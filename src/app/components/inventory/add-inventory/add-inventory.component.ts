import { InventoryCategory } from '@/src/app/models/Inventory/InventoryCategory';
import { InventoryCategoryCreateRequest } from '@/src/app/models/Inventory/InventoryCategoryCreateRequest';
import { InventoryItemCreateRequest } from '@/src/app/models/Inventory/InventoryItemCreateRequest';
import { InventoryService } from '@/src/app/services/inventory.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-add-inventory',
    templateUrl: './add-inventory.component.html',
    styleUrl: './add-inventory.component.css',
    imports: [
    NgIcon,
    ReactiveFormsModule,
    NgClass
],
})
export class AddInventoryComponent implements OnInit {
  addCategory: Boolean = false;
  categoryList: InventoryCategory[] = [];
  categoryForm: FormGroup<any> | undefined;
  itemForm: FormGroup<any> | undefined;
  sendingData: Boolean = false;
  inventoryService = inject(InventoryService);
  router = inject(Router);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.resetCategories();

    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      price: ['', Validators.required],
    });
  }

  resetCategories() {
    this.inventoryService.getInventoryCategories().subscribe((res) => {
      this.categoryList = res;
    });
  }

  get c() {
    return this.itemForm!.controls;
  }

  get f() {
    return this.categoryForm!.controls;
  }

  onCategoryChange(event: any): void {
    const cat = this.categoryList.find((c) => c.id == event.value);
    if (cat) {
      this.itemForm!.get('categoryId')!.setValue(cat.id);
    }
  }

  toggleCategory() {
    this.addCategory = !this.addCategory;
  }

  onItemSubmit() {
    this.sendingData = true;
    if (this.itemForm && this.itemForm.valid) {
      const data: InventoryItemCreateRequest = {
        name: this.itemForm.get('name')!.value,
        price: this.itemForm.get('price')!.value,
      };
      const path = this.itemForm.get('categoryId')!.value;
      this.inventoryService.createInventoryItem(data, path).subscribe({
        next: (response) => {
          this.router.navigate(['/inventory']);
          this.sendingData = false;
        },
        error: (error) => {
          console.error('Error creating item', error);
          this.sendingData = false;
        },
      });
      this.itemForm.reset();
    }
  }

  onCategorySubmit() {
    if (this.categoryForm && this.categoryForm.valid) {
      const data: InventoryCategoryCreateRequest = this.categoryForm.value;
      this.inventoryService.createInventoryCategory(data).subscribe({
        next: (response) => {
          this.sendingData = false;
          this.categoryForm!.reset();
          this.resetCategories();
          this.addCategory = !this.addCategory;
        },
        error: (error) => {
          console.error('Error creating item', error);
          this.sendingData = false;
        },
      });
    }
  }
}
