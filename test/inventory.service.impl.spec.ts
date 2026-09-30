import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InventoryServiceImpl } from '../src/modules/inventory/services/inventory.service.impl';
import { InventoryRepository } from '../src/modules/inventory/repositories/inventory.repository';

describe('InventoryServiceImpl', () => {
  let service: InventoryServiceImpl;
  let repository: jest.Mocked<InventoryRepository>;

  const mockItem = {
    id: 'inv-1',
    sku: 'item-1',
    name: 'Sample Item',
    availableQuantity: 10,
    price: 99.99 as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepo = {
      create: jest.fn(),
      findBySku: jest.fn(),
      updateQuantity: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryServiceImpl,
        { provide: InventoryRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get<InventoryServiceImpl>(InventoryServiceImpl);
    repository = module.get(InventoryRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deductStock', () => {
    it('should successfully deduct stock when available quantity is sufficient', async () => {
      repository.findBySku.mockResolvedValue(mockItem);
      repository.updateQuantity.mockResolvedValue({
        ...mockItem,
        availableQuantity: 7,
      });

      const result = await service.deductStock({ sku: 'item-1', quantity: 3 });

      expect(repository.findBySku).toHaveBeenCalledWith('item-1');
      expect(repository.updateQuantity).toHaveBeenCalledWith('inv-1', 7);
      expect(result.availableQuantity).toBe(7);
    });

    it('should throw NotFoundException when item does not exist', async () => {
      repository.findBySku.mockResolvedValue(null);

      await expect(
        service.deductStock({ sku: 'unknown-sku', quantity: 1 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when available stock is less than requested', async () => {
      repository.findBySku.mockResolvedValue(mockItem); // has 10

      await expect(
        service.deductStock({ sku: 'item-1', quantity: 25 }),
      ).rejects.toThrow(BadRequestException);

      expect(repository.updateQuantity).not.toHaveBeenCalled();
    });
  });

  describe('getAllItems', () => {
    it('should return all inventory items', async () => {
      repository.findAll.mockResolvedValue([mockItem]);

      const result = await service.getAllItems();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockItem]);
    });
  });

  describe('createItem', () => {
    it('should create an inventory item', async () => {
      repository.create.mockResolvedValue(mockItem);

      const result = await service.createItem({
        sku: 'item-1',
        name: 'Sample Item',
        quantity: 10,
        price: 99.99,
      });

      expect(repository.create).toHaveBeenCalledWith({
        sku: 'item-1',
        name: 'Sample Item',
        quantity: 10,
        price: 99.99,
      });
      expect(result).toEqual(mockItem);
    });
  });
});
