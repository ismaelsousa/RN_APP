import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {Alert, Platform, ScrollView, StatusBar} from 'react-native';
import {useTheme} from 'styled-components';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import Button from '~/components/Button';
import HeaderOptions from '~/components/HeaderOptions';
import Icon from '~/components/Icon';
import Input from '~/components/Input';
import Separator from '~/components/Separator';
import Text from '~/components/Text';
import useSignInNavigation from '~/hooks/useSignInNavigation';

import {Container, AccessText} from './styles';
import {schemaLogin} from './validation';
import BackButton from '~/components/BackButton';
import appleAuth, {
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';
import useAuth from '~/hooks/useAuth';
import AvoidKeyboard from '~/components/AvoidKeyboard';

const Login: React.FC = () => {
  const {spacing} = useTheme();
  const navigation = useSignInNavigation();

  /**
   * Hooks
   */
  const {
    loading,
    signIn,
    signInApple,
    checkIfExistUser,
    checkIfExistAppleUser,
    signUp,
  } = useAuth();

  /**
   * Forms
   */

  const {
    control,
    handleSubmit,
    setValue,
    setFocus,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schemaLogin),
    defaultValues: {
      email: __DEV__ ? 'ismael.sousa@gmail.com' : '',
      password: __DEV__ ? 'B4gJQR@o@AnXVkU!A4CaYJl68LR!jhuVm&flaPu$C*0' : '',
    },
  });
  /**
   * Callback
   */
  const handleGoBack = () => navigation.goBack();

  const onSubmit = async () => {
    await handleSubmit(async ({email, password}) => {
      await signIn({email, password});
    })();
  };

  const handleAppleButton = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      const hasUser = await checkIfExistAppleUser(
        appleAuthRequestResponse.user,
      );
      if (hasUser) {
        await signInApple(appleAuthRequestResponse.user);
      } else {
        await signUp({
          ...(appleAuthRequestResponse?.user
            ? {userApple: appleAuthRequestResponse?.user}
            : {}),
          ...(appleAuthRequestResponse?.email
            ? {email: appleAuthRequestResponse?.email}
            : {}),
          ...(appleAuthRequestResponse?.fullName?.familyName
            ? {lastName: appleAuthRequestResponse?.fullName?.familyName}
            : {}),
          ...(appleAuthRequestResponse?.fullName?.givenName
            ? {firstName: appleAuthRequestResponse?.fullName?.givenName}
            : {}),
        });
      }
    }
  };

  const handleGoogleButton = async () => {
    try {
      const {user} = await GoogleSignin.signIn();

      const hasUser = await checkIfExistUser(user.email);
      if (hasUser) {
        await signIn({email: user.email});
      } else {
        await signUp({
          avatar: user.photo ?? undefined,
          email: user.email ?? undefined,
          firstName: user.givenName ?? undefined,
          lastName: user.familyName ?? undefined,
        });
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Ops!', 'Ocorreu um erro ao realizar o login');
    }
  };

  return (
    <AvoidKeyboard>
      <Container>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={'transparent'}
          translucent
        />
        <HeaderOptions
          left={<BackButton icon="closeX" onPress={handleGoBack} />}
          right={
            <Text color="primary" typography="body3">
              Esqueci minha senha
            </Text>
          }
        />
        <Separator height={spacing.md} />
        <ScrollView>
          <Text typography="h3">Login</Text>
          <Separator height={spacing.md} />
          <Controller
            control={control}
            name="email"
            render={({field: {onBlur, onChange, value, ref}}) => (
              <Input
                ref={ref}
                autoCapitalize="none"
                autoCompleteType="email"
                keyboardType="email-address"
                onChange={onChange}
                onChangeText={text => setValue('email', text)}
                value={value}
                onBlur={onBlur}
                label="Email"
                icon="checkCircle"
                iconColor="primary"
                error={errors.email?.message}
                returnKeyType="next"
                onSubmitEditing={() => {
                  setFocus('password');
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({field: {onBlur, onChange, value, ref}}) => (
              <Input
                ref={ref}
                label="Senha"
                autoCapitalize="none"
                autoCompleteType="password"
                secureTextEntry
                iconColor="primary"
                onChange={onChange}
                onChangeText={text => setValue('password', text)}
                value={value}
                onBlur={onBlur}
                error={errors.password?.message}
                returnKeyType="done"
                onSubmitEditing={onSubmit}
              />
            )}
          />
          <Separator height={spacing.md} />
          <Button loading={loading} disabled={loading} onPress={onSubmit}>
            Login
          </Button>
          <Separator height={spacing.md} />
          <AccessText color="surface500" typography="body3">
            ou acesse com login social
          </AccessText>
          <Separator height={spacing.md} />
          {(appleAuthAndroid.isSupported || Platform.OS === 'ios') && (
            <>
              <Button
                onPress={handleAppleButton}
                typography="caption"
                icon={<Icon icon="apple" />}
                color="secondary"
                mode="outlined">
                Continuar com a Apple
              </Button>
              <Separator height={spacing.md} />
            </>
          )}
          <Button
            onPress={handleGoogleButton}
            typography="caption"
            icon={<Icon icon="google" />}
            color="secondary"
            mode="outlined">
            Continuar com o Google
          </Button>
          <Separator height={spacing.xxl} />
        </ScrollView>
      </Container>
    </AvoidKeyboard>
  );
};

export default Login;
