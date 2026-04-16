import adressData from "../api/adress.json";

export interface Adress {
    id: number;
    name: string;
    street: string;
    zip: string;
    city: string;
    country: string;
}

export const fetchAdress = () =>{
    const adresses: Adress[] = adressData.adress;
    return new Promise<Adress>((resolve, reject) => {
        setTimeout(() => {
            try {
                const rand = Math.floor(Math.random() * 50);
                resolve(adresses[rand]);
            } catch (e) {
                reject(e);
            }
        }, 200);
    })
}