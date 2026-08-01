import * as Notifications from 'expo-notifications';

export async function requestPermission(){
    const { status } = await Notifications.getPermissionsAsync();

    if(status === "granted"){
        return true;
    }

    const response = await Notifications.requestPermissionsAsync();

    return response.status === "granted";

}