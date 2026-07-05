import { useSelector } from "react-redux";
import styles from "../styles/commonStyle";
import actionStyle from "../styles/actionStyle";

export function useThemeStyles(){
    const theme = useSelector((state) => state.theme.theme);

    return styles(theme);
}

export function useActionStyles(){
    const theme = useSelector((state) => state.theme.theme);

    return actionStyle(theme);
}

