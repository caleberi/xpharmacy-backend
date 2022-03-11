import { Sale } from 'src/entities/report.entity';
import { EntityRepository, Repository } from 'typeorm';
@EntityRepository(Sale)
export class SaleRepository extends Repository<Sale> {}
