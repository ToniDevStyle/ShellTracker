import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";


export const updateUSer = async(
    uid: string,
    updatedData:  UserDataType
): Promise<ResponseType> => {
    try{
        //image upload
        if(updatedData?.image && typeof updatedData?.image?.uri ){
            const imageUploadRes = await uploadFileToCloudinary(updatedData?.image, 'users');
            if(!imageUploadRes.success){
                return {success: false, msg: imageUploadRes.msg || 'Error al subir la imagen'};
            }
            updatedData.image = imageUploadRes.data;
        }

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