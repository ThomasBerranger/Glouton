import moment from "moment/moment";
import type {Product} from "@/interfaces/product";
import type {ExpirationDate} from "@/interfaces/expiration-date";

// async function add(product) {
//     const db = getFirestore(getApp());
//
//     await addDoc(collection(db, 'products'), product)
// }

// async function update(product) {
//     const db = getFirestore(getApp());
//     const productRef = doc(db, "products", product.id);
//
//     await updateDoc(productRef, product);
// }

// async function remove(product) {
//     const db = getFirestore(getApp());
//
//     await deleteDoc(doc(db, 'products', product.id));
// }

function getNearestExpirationDate(product: Product): ExpirationDate {
    return product.expirationDates.reduce((nearest: ExpirationDate, current: ExpirationDate) => {
        return new Date(current.date) < new Date(nearest.date) ? current : nearest;
    });
}

export {getNearestExpirationDate};