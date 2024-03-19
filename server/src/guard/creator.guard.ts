import {BadRequestException, CanActivate, ExecutionContext, Injectable, NotFoundException} from '@nestjs/common';
import {UserService} from '../user/service/user.service';


@Injectable()
export class CreatorGuard implements CanActivate {
    constructor(private readonly userService: UserService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const {id, type} = request.params;

        let entity;

        switch (type){
            case 'user':
                entity = await this.userService.findOneById(id);
                break;
            default:
                throw new NotFoundException('Something went wrong...')
        }

        const userIdFromRequest = request.user?.id;

        if (entity && entity.id === userIdFromRequest) {
            return true;
        }

        throw new BadRequestException(
            'You cannot edit this record because you are not its creator!',
        );
    }
}