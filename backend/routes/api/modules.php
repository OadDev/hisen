<?php

use App\Http\Controllers\Api\AmcContractController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\BomComponentController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\GoodsReceiptController;
use App\Http\Controllers\Api\InstallationController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\MrpRequirementController;
use App\Http\Controllers\Api\NcrController;
use App\Http\Controllers\Api\PayableController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\PurchaseOrderController;
use App\Http\Controllers\Api\QcInspectionController;
use App\Http\Controllers\Api\QuotationController;
use App\Http\Controllers\Api\RfqController;
use App\Http\Controllers\Api\SalesOrderController;
use App\Http\Controllers\Api\ServiceTicketController;
use App\Http\Controllers\Api\ShipmentController;
use App\Http\Controllers\Api\StockItemController;
use App\Http\Controllers\Api\StockTransferController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\VendorController;
use App\Http\Controllers\Api\WarehouseController;
use App\Http\Controllers\Api\WarrantyClaimController;
use App\Http\Controllers\Api\WorkOrderController;
use Illuminate\Support\Facades\Route;

// CRM
Route::get('/leads', [LeadController::class, 'index']);
Route::post('/leads', [LeadController::class, 'store']);
Route::get('/leads/{code}', [LeadController::class, 'show']);
Route::patch('/leads/{code}', [LeadController::class, 'update']);
Route::post('/leads/{code}/activities', [LeadController::class, 'addActivity']);

// Customers
Route::apiResource('customers', CustomerController::class)->parameters(['customers' => 'code']);

// Catalog
Route::apiResource('products', ProductController::class);

// Quotations
Route::get('/quotations', [QuotationController::class, 'index']);
Route::post('/quotations', [QuotationController::class, 'store']);
Route::get('/quotations/{code}', [QuotationController::class, 'show']);
Route::patch('/quotations/{code}', [QuotationController::class, 'update']);
Route::post('/quotations/{code}/convert', [QuotationController::class, 'convertToSalesOrder']);

// Sales Orders
Route::get('/sales-orders', [SalesOrderController::class, 'index']);
Route::get('/sales-orders/{code}', [SalesOrderController::class, 'show']);
Route::patch('/sales-orders/{code}', [SalesOrderController::class, 'update']);

// Production
Route::apiResource('work-orders', WorkOrderController::class);
Route::get('/mrp', [MrpRequirementController::class, 'index']);
Route::get('/bom', [BomComponentController::class, 'index']);
Route::post('/bom', [BomComponentController::class, 'store']);
Route::patch('/bom/{bomComponent}', [BomComponentController::class, 'update']);
Route::delete('/bom/{bomComponent}', [BomComponentController::class, 'destroy']);

// Purchase
Route::apiResource('vendors', VendorController::class);
Route::apiResource('rfqs', RfqController::class);
Route::apiResource('purchase-orders', PurchaseOrderController::class);
Route::apiResource('goods-receipts', GoodsReceiptController::class);

// Inventory
Route::apiResource('warehouses', WarehouseController::class);
Route::apiResource('stock-items', StockItemController::class);
Route::apiResource('stock-transfers', StockTransferController::class);

// Quality
Route::apiResource('qc-inspections', QcInspectionController::class);
Route::apiResource('ncrs', NcrController::class);

// Dispatch & Installation
Route::apiResource('shipments', ShipmentController::class);
Route::apiResource('installations', InstallationController::class);

// Service, Spares, AMC
Route::apiResource('service-tickets', ServiceTicketController::class);
Route::apiResource('warranty-claims', WarrantyClaimController::class);
Route::apiResource('amc-contracts', AmcContractController::class);

// Finance
Route::apiResource('invoices', InvoiceController::class);
Route::apiResource('expenses', ExpenseController::class);
Route::apiResource('payables', PayableController::class);

// Administration
Route::middleware('role:super_admin')->group(function () {
    Route::apiResource('users', UserController::class)->except(['show']);
});
Route::get('/audit-logs', [AuditLogController::class, 'index']);
