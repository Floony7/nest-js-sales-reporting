import { NestInterceptor, ExecutionContext, CallHandler, UseInterceptors } from "@nestjs/common";
import  { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { plainToInstance } from "class-transformer";

interface ClassConstruuctor {
    new (...args: any[]): {};
}

export function Serialize(dto: ClassConstruuctor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: ClassConstruuctor) {}
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        //  Run something before the request is handled by the request handler
        console.log('Im running before the handler', context);
        return handler.handle().pipe(
            map((data: any) => {
                // Run before response is sent out
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true,
                })
            })
        )

    }
}