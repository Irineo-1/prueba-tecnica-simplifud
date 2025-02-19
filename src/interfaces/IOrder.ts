export interface IOrder {
    order_num: number;
    channel: string;
    created_at: Date;
    created_at_visual?: string;
    customer_name: string;
    delivery_date: Date;
    delivery_date_visual?: string;
    delivery_time: Date;
    delivery_time_visual?: string;
    id: string;
}