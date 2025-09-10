import { Injectable, signal, computed, effect } from '@angular/core';
import { ConfigService } from './config.service';
import { ErrorHandlerService } from './error-handler.service';

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface NetworkInformation {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  type: 'timing' | 'counter' | 'gauge';
}

export interface PerformanceReport {
  gameLoading: {
    cardsLoadTime: number;
    gameInitTime: number;
  };
  cardOperations: {
    averageFlipTime: number;
    averageMatchCheckTime: number;
    totalFlips: number;
  };
  rendering: {
    averageFPS: number;
    frameDrops: number;
    renderTime: number;
  };
  memory: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  storage: {
    localStorageSize: number;
    saveOperationTime: number;
    loadOperationTime: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private readonly _metrics = signal<PerformanceMetric[]>([]);
  private readonly _isMonitoring = signal<boolean>(false);
  private readonly _currentFPS = signal<number>(60);

  public readonly metrics = this._metrics.asReadonly();
  public readonly isMonitoring = this._isMonitoring.asReadonly();
  public readonly currentFPS = this._currentFPS.asReadonly();

  // Computed performance indicators
  public readonly averageLoadTime = computed(() => {
    const loadMetrics = this._metrics().filter(m => m.name.includes('load'));
    if (loadMetrics.length === 0) return 0;
    return loadMetrics.reduce((sum, m) => sum + m.value, 0) / loadMetrics.length;
  });

  public readonly performanceScore = computed(() => {
    const fps = this._currentFPS();
    const loadTime = this.averageLoadTime();

    // Calculate score based on FPS (0-40), load time (0-40), and other factors (0-20)
    const fpsScore = Math.min(40, (fps / 60) * 40);
    const loadScore = Math.max(0, 40 - (loadTime / 100)); // Penalize slow loads

    return Math.round(fpsScore + loadScore + 20); // Base score of 20
  });

  // Performance thresholds
  private readonly thresholds = {
    cardLoadTime: 2000, // 2 seconds
    gameInitTime: 1000, // 1 second
    flipTime: 100, // 100ms
    saveTime: 50, // 50ms
    minFPS: 30
  };

  // Monitoring state
  private readonly frameCount = 0;
  private readonly lastFrameTime = 0;
  private animationFrameId: number | null = null;
  private readonly timingMarks = new Map<string, number>();

  public constructor(
    private readonly configService: ConfigService,
    private readonly errorHandler: ErrorHandlerService
  ) {
    this.initializeMetrics();

    if (this.configService.isPerformanceMonitoringEnabled() === true) {
      this.startMonitoring();
    }

    this.setupPerformanceEffects();
  }

  /**
   * Starts performance monitoring
   */
  public startMonitoring(): void {
    if (this._isMonitoring() === true) return;

    this._isMonitoring.set(true);
    this.startFPSMonitoring();
    this.setupPerformanceObserver();
    this.recordMetric('monitoring_started', performance.now(), 'timing');
  }

  /**
   * Stops performance monitoring
   */
  public stopMonitoring(): void {
    if (this._isMonitoring() === false) return;

    this._isMonitoring.set(false);
    this.stopFPSMonitoring();
    this.recordMetric('monitoring_stopped', performance.now(), 'timing');
  }

  /**
   * Marks the start of a performance measurement
   */
  public markStart(name: string): void {
    this.timingMarks.set(name, performance.now());
    if (this.configService.isProduction()) return;

    try {
      performance.mark(`${name}_start`);
    } catch {
      // Silently handle unsupported browsers
    }
  }

  /**
   * Marks the end of a performance measurement and records the duration
   */
  public markEnd(name: string): number {
    const startTime = this.timingMarks.get(name);
    const endTime = performance.now();

    if (startTime != null) {
      const duration = endTime - startTime;
      this.recordMetric(name, duration, 'timing');
      this.timingMarks.delete(name);

      // Check against thresholds
      this.checkThreshold(name, duration);

      if (!this.configService.isProduction()) {
        try {
          performance.mark(`${name}_end`);
          performance.measure(name, `${name}_start`, `${name}_end`);
        } catch {
          // Silently handle unsupported browsers
        }
      }

      return duration;
    }

    return 0;
  }

  /**
   * Records a custom performance metric
   */
  public recordMetric(name: string, value: number, type: PerformanceMetric['type']): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date(),
      type
    };

    const currentMetrics = this._metrics();
    const updatedMetrics = [...currentMetrics, metric];

    // Keep only the last 1000 metrics to prevent memory issues
    if (updatedMetrics.length > 1000) {
      updatedMetrics.splice(0, updatedMetrics.length - 1000);
    }

    this._metrics.set(updatedMetrics);
  }

  /**
   * Gets performance report for analysis
   */
  public getPerformanceReport(): PerformanceReport {
    const metrics = this._metrics();
    const memoryInfo = this.getMemoryInfo();

    return {
      gameLoading: {
        cardsLoadTime: this.getAverageMetric(metrics, 'cards_load'),
        gameInitTime: this.getAverageMetric(metrics, 'game_init')
      },
      cardOperations: {
        averageFlipTime: this.getAverageMetric(metrics, 'card_flip'),
        averageMatchCheckTime: this.getAverageMetric(metrics, 'match_check'),
        totalFlips: this.getMetricCount(metrics, 'card_flip')
      },
      rendering: {
        averageFPS: this._currentFPS(),
        frameDrops: this.getMetricCount(metrics, 'frame_drop'),
        renderTime: this.getAverageMetric(metrics, 'render')
      },
      memory: memoryInfo,
      storage: {
        localStorageSize: this.getLocalStorageSize(),
        saveOperationTime: this.getAverageMetric(metrics, 'save_operation'),
        loadOperationTime: this.getAverageMetric(metrics, 'load_operation')
      }
    };
  }

  /**
   * Optimizes performance based on current metrics
   */
  public optimizePerformance(): void {
    const report = this.getPerformanceReport();
    const suggestions: string[] = [];

    // Check FPS
    if (report.rendering.averageFPS < this.thresholds.minFPS) {
      suggestions.push('Consider reducing animation complexity or deck size');
      this.recordMetric('performance_warning_low_fps', report.rendering.averageFPS, 'gauge');
    }

    // Check load times
    if (report.gameLoading.cardsLoadTime > this.thresholds.cardLoadTime) {
      suggestions.push('Card loading is slow, consider optimizing images or using CDN');
      this.recordMetric('performance_warning_slow_load', report.gameLoading.cardsLoadTime, 'timing');
    }

    // Check memory usage
    if (report.memory.usedJSHeapSize > report.memory.jsHeapSizeLimit * 0.8) {
      suggestions.push('High memory usage detected, consider clearing old game data');
      this.recordMetric('performance_warning_high_memory', report.memory.usedJSHeapSize, 'gauge');
    }

    // Log suggestions in development
    if (!this.configService.isProduction() && suggestions.length > 0) {
      console.group('🚀 Performance Optimization Suggestions');
      suggestions.forEach(suggestion => console.warn(suggestion));
      console.groupEnd();
    }
  }

  /**
   * Clears all performance metrics
   */
  public clearMetrics(): void {
    this._metrics.set([]);
    this.timingMarks.clear();

    try {
      performance.clearMarks();
      performance.clearMeasures();
    } catch {
      // Silently handle unsupported browsers
    }
  }

  /**
   * Gets current device performance capabilities
   */
  public getDeviceCapabilities(): object {
    return {
      hardwareConcurrency: navigator.hardwareConcurrency ?? 1,
      deviceMemory: (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 'unknown',
      connection: this.getConnectionInfo(),
      screen: {
        width: screen.width,
        height: screen.height,
        pixelRatio: window.devicePixelRatio
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  /**
   * Sets up performance monitoring effects
   */
  private setupPerformanceEffects(): void {
    // Monitor performance score changes
    effect(() => {
      const score = this.performanceScore();
      if (score < 60) {
        this.optimizePerformance();
      }
    });
  }

  /**
   * Starts FPS monitoring
   */
  private startFPSMonitoring(): void {
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = (currentTime: number): void => {
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        this._currentFPS.set(fps);
        this.recordMetric('fps', fps, 'gauge');

        frameCount = 0;
        lastTime = currentTime;
      }

      if (this._isMonitoring()) {
        this.animationFrameId = requestAnimationFrame(measureFPS);
      }
    };

    this.animationFrameId = requestAnimationFrame(measureFPS);
  }

  /**
   * Stops FPS monitoring
   */
  private stopFPSMonitoring(): void {
    if (this.animationFrameId != null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Sets up Performance Observer for detailed metrics
   */
  private setupPerformanceObserver(): void {
    if (typeof PerformanceObserver === 'undefined') return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.recordMetric(
            `browser_${entry.name}`,
            entry.duration || entry.startTime,
            'timing'
          );
        });
      });

      observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
    } catch {
      // Silently handle unsupported browsers
    }
  }

  /**
   * Checks if a metric exceeds threshold and logs warning
   */
  private checkThreshold(name: string, value: number): void {
    const thresholdValue = (this.thresholds as Record<string, number>)[name.replace('_time', 'Time')];
    if (thresholdValue != null && value > thresholdValue) {
      this.recordMetric(`threshold_exceeded_${name}`, value, 'timing');

      if (!this.configService.isProduction()) {
        console.warn(
          `⚠️ Performance threshold exceeded: ${name} took ${Math.round(value)}ms ` +
          `(threshold: ${thresholdValue}ms)`
        );
      }
    }
  }

  /**
   * Gets average value for a specific metric type
   */
  private getAverageMetric(metrics: PerformanceMetric[], namePattern: string): number {
    const matchingMetrics = metrics.filter(m => m.name.includes(namePattern));
    if (matchingMetrics.length === 0) return 0;

    return matchingMetrics.reduce((sum, m) => sum + m.value, 0) / matchingMetrics.length;
  }

  /**
   * Gets count of metrics matching a pattern
   */
  private getMetricCount(metrics: PerformanceMetric[], namePattern: string): number {
    return metrics.filter(m => m.name.includes(namePattern)).length;
  }

  /**
   * Gets current memory information
   */
  private getMemoryInfo(): object {
    const memoryInfo = (performance as unknown as { memory?: MemoryInfo }).memory;
    if (memoryInfo != null) {
      return {
        usedJSHeapSize: memoryInfo.usedJSHeapSize,
        totalJSHeapSize: memoryInfo.totalJSHeapSize,
        jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit
      };
    }

    return {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0
    };
  }

  /**
   * Gets localStorage size in bytes
   */
  private getLocalStorageSize(): number {
    try {
      let total = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch {
      return 0;
    }
  }

  /**
   * Gets network connection information
   */
  private getConnectionInfo(): object | null {
    const nav = navigator as unknown as {
      connection?: NetworkInformation;
      mozConnection?: NetworkInformation;
      webkitConnection?: NetworkInformation;
    };
    const connection = nav.connection ?? nav.mozConnection ?? nav.webkitConnection;

    if (connection != null) {
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }

    return null;
  }
}
