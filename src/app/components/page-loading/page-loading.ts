import { Component, input } from '@angular/core';
import { BlockUI } from 'primeng/blockui';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-page-loading',
  imports: [BlockUI, ProgressSpinner],
  templateUrl: './page-loading.html',
  styleUrl: './page-loading.css',
})
export class PageLoading {
  isLoading = input.required<boolean>();
}
