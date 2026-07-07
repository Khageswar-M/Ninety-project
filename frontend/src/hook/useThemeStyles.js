import { useSelector } from "react-redux";
import styles from "../styles/commonStyle";
import actionStyle from "../styles/actionStyle";
import resultStyles from "../styles/resultsStyle";
import settingsStyles from "../styles/settingsStyle";

export function useThemeStyles(){
    const theme = useSelector((state) => state.theme.theme);

    return styles(theme);
}

export function useActionStyles(){
    const theme = useSelector((state) => state.theme.theme);

    return actionStyle(theme);
}

export function useResultStyles(){
    const theme = useSelector((state) => state.theme.theme);

    return resultStyles(theme);
}

export function useSettingStyles() {
    const theme = useSelector((state) => state.theme.theme);

    return settingsStyles(theme);
}



