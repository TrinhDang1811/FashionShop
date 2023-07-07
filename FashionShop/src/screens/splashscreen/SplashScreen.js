import {StyleSheet, View, Image} from 'react-native';
import React, {useEffect} from 'react';
import useRefreshToken from '../../hooks/useRefreshToken';
import useAuth from '../../hooks/useAuth';
import color from '../../constants/color';
import {IMG_SplashLogo} from '../../assets/images';

const SplashScreen = ({isLoading, setIsLoading}) => {
  const refresh = useRefreshToken();
  const {auth} = useAuth();
  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  useEffect(() => {
    // console.log(`isLoading: ${isLoading}`)
    // console.log(`aT: ${auth?.accessToken}`)
  }, [isLoading]);

  return (
    <View style={styles.container}>
      <Image source={IMG_SplashLogo} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.White,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
