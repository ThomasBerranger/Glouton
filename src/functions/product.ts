import moment from "moment/moment";
import type {Product} from "@/interfaces/product";
import type {ExpirationDate} from "@/interfaces/expiration-date";

function getNearestExpirationDate(product: Product): ExpirationDate {
    return product.expirationDates.reduce((nearest: ExpirationDate, current: ExpirationDate) => {
        return new Date(current.date) < new Date(nearest.date) ? current : nearest;
    });
}

export {getNearestExpirationDate};