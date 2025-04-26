import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";


export const updateUSer = async(
    uid: string,
    updatedData:  UserDataType
): Promise<ResponseType> => {
    try{
        //image upload
        const userRef = doc(firestore, 'users', uid);
        await updateDoc(userRef, updatedData);

        return {success: true, msg: 'Usuario actualizado correctamente'};
    }catch(error: any){
        console.log('Error updating user', error);
        return {
            success: false,
            msg: error?.message
        }
    }
}