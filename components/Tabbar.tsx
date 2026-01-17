import { Feather } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { JSX } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function Tabbar({state, descriptors, navigation}: BottomTabBarProps) {
  
  type TabRoute = 'home' | 'settings' | 'profile' | 'search';

const icon: Record<TabRoute, (props: any) => JSX.Element> = {
  home: (props) => <Feather name="home" {...props} />,
  settings: (props) => <Feather name="settings" {...props} />,
  profile: (props) => <Feather name="user" {...props} />,
  search: (props) => <Feather name="search" {...props} />,
};

  
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        let label: string;

        if (typeof options.tabBarLabel === 'string') {
          label = options.tabBarLabel;
        } else if (typeof options.title === 'string') {
          label = options.title;
        } else {
          label = route.name;
        }


        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
          >
            {icon[route.name as TabRoute]({ size: 24, color: isFocused ? '#673ab7' : '#222' })}
            <Text style={{color: isFocused ? '#673ab7' : '#222'}}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default Tabbar;


const styles = StyleSheet.create({
 tabBar: {
  position: 'absolute',
  flexDirection: 'row',
  bottom: 30,
  width: '90%',
  alignSelf: 'center',
  alignItems: 'center',
  backgroundColor: '#fff',
  paddingHorizontal: 20,
  paddingVertical: 15,
  borderRadius: 35,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowRadius: 10,
  shadowOpacity: 0.25,
  elevation: 5,
},

  tabbarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  }
});