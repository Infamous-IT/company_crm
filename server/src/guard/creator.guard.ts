import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/service/user.service';
import { TagsService } from '../tags/service/tags.service';
import { CustomerService } from '../customer/service/customer.service';
import { OrdersService } from '../orders/service/orders.service';

@Injectable()
export class CreatorGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly tagService: TagsService,
    private readonly customerService: CustomerService,
    private readonly orderService: OrdersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { id, type } = request.params;

    let entity;

    switch (type) {
      case 'user':
        entity = await this.userService.findOneById(id);
        break;
      case 'tag':
        entity = await this.tagService.findOne(id);
        break;
      case 'customers':
        entity = await this.customerService.findOne(id);
        break;
      case 'orders':
        entity = await this.orderService.findOne(id);
        break;
      default:
        throw new NotFoundException('Something went wrong...');
    }

    const userIdFromRequest = request.user?.id;

    if (entity?.user?.id || (entity && entity.id === userIdFromRequest)) {
      return true;
    }

    throw new BadRequestException('You cannot edit this record because you are not its creator!');
  }
}
