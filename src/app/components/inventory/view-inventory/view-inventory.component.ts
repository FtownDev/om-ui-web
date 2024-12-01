import { InventoryCategory } from '@/src/app/models/Inventory/InventoryCategory';
import { InventoryItem } from '@/src/app/models/Inventory/InventoryItem';
import { InventoryService } from '@/src/app/services/inventory.service';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-inventory',
  standalone: false,

  templateUrl: './view-inventory.component.html',
  styleUrl: './view-inventory.component.css',
})
export class ViewInventoryComponent implements OnInit {
  inventoryService = inject(InventoryService);
  router = inject(Router);
  categories: InventoryCategory[] = [];
  items: InventoryItem[] = [];

  expandedCategories: { [key: string]: boolean } = {};

  distributedCategories: any[][] = [[], [], []];
  ngOnInit() {
    this.inventoryService
      .getInventoryCategories()
      .subscribe((res: InventoryCategory[]) => (this.categories = res));

    this.inventoryService
      .getInventoryItems()
      .subscribe((res: InventoryItem[]) => (this.items = res));

    this.distributeCategories();
  }

  distributeCategories() {
    this.categories.forEach((category, index) => {
      this.distributedCategories[index % 3].push(category);
    });
  }
  toggleCategory(categoryId: string) {
    this.expandedCategories[categoryId] = !this.expandedCategories[categoryId];
  }

  getCategoryName(id: string) {
    const cat = this.categories.find((e) => e['id'] === id);
    return cat ? cat['name'] : null;
  }
}
