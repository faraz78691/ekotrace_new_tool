import { TestBed } from '@angular/core/testing';

import { PurchaseGoodsService } from './purchase-goods.service';

describe('PurchaseGoodsService', () => {
  let service: PurchaseGoodsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseGoodsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
