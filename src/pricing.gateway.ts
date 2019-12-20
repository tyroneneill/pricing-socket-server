import { WebSocketGateway, SubscribeMessage, WsResponse, MessageBody } from '@nestjs/websockets';
import { Observable, of, interval } from 'rxjs';
import { expand, delay, map } from 'rxjs/operators';

export interface Price {
  readonly symbol: string;
  readonly bid: number;
  readonly ask: number;
  readonly ratePrecision: number;
}

export interface PriceRequest {
  readonly symbol: string;
}

@WebSocketGateway()
export class PricingGateway {

  @SubscribeMessage('get-price')
  public getPrice(@MessageBody() request: PriceRequest): Observable<WsResponse<Price>> {
    const { symbol } = request;
    return of<Price>({ symbol, bid: 1.234, ask: 1.423, ratePrecision: 0.0001 }).pipe(
      expand((price: Price) => {
        const increment = Math.random() >= 0.5;
        const adjustment = Math.random() * 0.1;
        const bid: number = increment ? price.bid + adjustment : price.bid - adjustment;
        const ask: number = bid - Math.random() * 0.05;
        return of({ ...price, bid, ask }).pipe(delay(1000));
      }),
      map(price => {
        return { event: `price-${symbol}-update`, data: price };
      }),
    );
  }

}
