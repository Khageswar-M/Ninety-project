import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { useThemeStyles } from '../../hook/useThemeStyles';

const Cell = ({ active, index }) => {
    const scale = useRef(new Animated.Value(active ? 0.5 : 1)).current;
    const style = useThemeStyles();

    useEffect(() => {
        if (active) {
            Animated.spring(scale, {
                toValue: 1,
                friction: 4,
                tension: 120,
                useNativeDriver: true,
                delay: index * 30
            }).start();
        }
    }, []);

    return (
        <Animated.View
            style={[
                style.box,
                active && style.activeBox,
                {
                    transform: [{ scale }],
                },
            ]}
        />
    );
};

const AppLogo = () => {

    const style = useThemeStyles();

    const board = [
        //00    01     02     03     04     05     06     07     08   
        [false, false, false, false, false, false, false, false, false],
        //10    11     12     13     14     15     16     17     18   
        [false, true, true, true, false, true, true, true, false],
        //20    21     22     23     24     25     26     27     28   
        [false, true, false, true, false, true, false, true, false],
        //30    31     32     33     34     35     36     37     38   
        [false, true, false, true, false, true, false, true, false],
        //40    41     42     43     44     45     46     47     48   
        [false, true, true, true, false, true, false, true, false],
        //50    51     52     53     54     55     56     57     58   
        [false, false, false, true, false, true, false, true, false],
        //60    61     62     63     64     65     66     67     68   
        [false, false, false, true, false, true, false, true, false],
        //70    71     72     73     74     75     76     77     78   
        [false, true, false, true, false, true, false, true, false],
        //80    81     82     83     84     85     86     87     88   
        [false, true, true, true, false, true, true, true, false],
        //90    91     92     93     94     95     96     97     98   
        [false, false, false, false, false, false, false, false, false],
    ];

    return (
            <View style={style.logoContainer}>
                {
                    board.flat().map((cell, index) => (
                        <Cell key={index} active={cell} index={index} />
                    ))
                }
            </View>
    )
}

export default AppLogo