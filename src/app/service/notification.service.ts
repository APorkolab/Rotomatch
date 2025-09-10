import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

interface NotificationConfig {
  timeout?: number;
  closeButton?: boolean;
  progressBar?: boolean;
  preventDuplicates?: boolean;
  positionClass?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly defaultConfig: Partial<IndividualConfig> = {
    timeOut: 5000,
    closeButton: true,
    progressBar: true,
    preventDuplicates: true
  };

  public constructor(private readonly toastr: ToastrService) {}

  public showSuccess(
    message: string,
    title: string = 'Success',
    config?: NotificationConfig
  ): void {
    const options = this.buildConfig(config);
    this.toastr.success(message, title, options);
  }

  public showError(
    message: string,
    title: string = 'Error',
    config?: NotificationConfig
  ): void {
    const options = this.buildConfig({
      timeout: 8000,
      ...config
    });
    this.toastr.error(message, title, options);
  }

  public showInfo(
    message: string,
    title: string = 'Info',
    config?: NotificationConfig
  ): void {
    const options = this.buildConfig(config);
    this.toastr.info(message, title, options);
  }

  public showWarning(
    message: string,
    title: string = 'Warning',
    config?: NotificationConfig
  ): void {
    const options = this.buildConfig({
      timeout: 7000,
      ...config
    });
    this.toastr.warning(message, title, options);
  }

  /**
   * Shows a game-specific achievement notification
   */
  public showAchievement(
    message: string,
    title: string = '🏆 Achievement Unlocked!'
  ): void {
    this.toastr.success(message, title, {
      ...this.defaultConfig,
      timeOut: 6000,
      toastClass: 'toast toast-achievement',
      titleClass: 'toast-title-achievement'
    });
  }

  /**
   * Shows game completion notification
   */
  public showGameComplete(
    attempts: number,
    time?: number,
    isNewRecord: boolean = false
  ): void {
    const timeText = (time != null && time > 0) ? ` in ${this.formatTime(time)}` : '';
    const recordText = isNewRecord ? ' 🎉 New Record!' : '';

    this.showSuccess(
      `Completed in ${attempts} attempts${timeText}${recordText}`,
      '🎊 Congratulations!',
      { timeout: 8000 }
    );
  }

  /**
   * Shows loading notification
   */
  public showLoading(
    message: string = 'Loading...',
    title: string = '⏳'
  ): void {
    this.showInfo(message, title, {
      timeout: 0, // Don't auto-dismiss
      closeButton: false,
      progressBar: false
    });
  }

  /**
   * Clears all notifications
   */
  public clearAll(): void {
    this.toastr.clear();
  }

  /**
   * Formats time in milliseconds to readable format
   */
  private formatTime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  }

  /**
   * Builds notification configuration
   */
  private buildConfig(config?: NotificationConfig): Partial<IndividualConfig> {
    return {
      ...this.defaultConfig,
      timeOut: config?.timeout ?? this.defaultConfig.timeOut,
      closeButton: config?.closeButton ?? this.defaultConfig.closeButton,
      progressBar: config?.progressBar ?? this.defaultConfig.progressBar,
      preventDuplicates: config?.preventDuplicates ?? this.defaultConfig.preventDuplicates,
      positionClass: config?.positionClass
    };
  }
}
