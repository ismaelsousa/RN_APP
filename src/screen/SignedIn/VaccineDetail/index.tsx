import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useMemo} from 'react';
import {Pressable, ScrollView, StatusBar} from 'react-native';
import {useTheme} from 'styled-components';
import QRCode from 'react-native-qrcode-svg';
import Icon from '~/components/Icon';
import Separator from '~/components/Separator';
import Shadow from '~/components/Shadow';
import Text from '~/components/Text';
import Center from '~/components/Center';
import {getRandomImageUnsplash} from '~/constants/unsplash';
import useConvertDose from '~/hooks/useConvertDose';
import {
  Container,
  Content,
  LogoVaccine,
  RowTextDetail,
  RowVaccine,
} from './styles';
import {format} from 'date-fns';

const VaccineDetail: React.FC = () => {
  const {goBack} = useNavigation();
  const {spacing, colors} = useTheme();

  const {
    params: {vaccine},
  } = useRoute<VaccineSignedInStackRouteProp>();

  const randomImage = useMemo(() => getRandomImageUnsplash(100), []);
  const dose = useConvertDose({shot: vaccine.dose});

  return (
    <Container>
      <StatusBar barStyle={'dark-content'} />
      <Separator height={spacing.md} />
      <Pressable onPress={goBack}>
        <Icon icon="closeX" size={15} />
      </Pressable>
      <Separator height={spacing.md} />
      <ScrollView>
        <Text typography="h7">Detalhe da vacina</Text>
        <Separator height={spacing.sm} />

        <Shadow>
          <Content>
            <RowVaccine>
              <LogoVaccine resizeMode="contain" source={{uri: randomImage}} />
              <Separator width={spacing.md} />
              <Text typography="h5">{vaccine.brand}</Text>
            </RowVaccine>
            <RowTextDetail>
              <Icon
                icon="vaccine"
                activeColor={colors.primary.main}
                size={24}
              />
              <Separator width={spacing.sm} />
              <Text typography="subtitle2" color="primary">
                Vacina
              </Text>
            </RowTextDetail>
            <RowTextDetail>
              <Text typography="caption">{vaccine.name}</Text>
            </RowTextDetail>
            <RowTextDetail>
              <Icon
                icon="calendar"
                activeColor={colors.primary.main}
                size={24}
              />
              <Separator width={spacing.sm} />
              <Text typography="subtitle2" color="primary">
                Data de aplicação
              </Text>
            </RowTextDetail>
            <RowTextDetail>
              <Text typography="caption">
                {format(new Date(vaccine.applicationDate), 'dd/MM/yyyy')}
              </Text>
            </RowTextDetail>
            <RowTextDetail>
              <Icon icon="pin" activeColor={colors.primary.main} size={24} />
              <Separator width={spacing.sm} />
              <Text typography="subtitle2" color="primary">
                Local de aplicação
              </Text>
            </RowTextDetail>
            <RowTextDetail>
              <Text typography="caption">
                {/**
                 * FIXME: Add real data
                 * vaccine*/}
                {vaccine.place}
              </Text>
            </RowTextDetail>
            <RowTextDetail>
              <Icon icon="pin" activeColor={colors.primary.main} size={24} />
              <Separator width={spacing.sm} />
              <Text typography="subtitle2" color="primary">
                Dose
              </Text>
            </RowTextDetail>
            <RowTextDetail>
              <Text typography="caption">{dose.title}</Text>
            </RowTextDetail>
            <Separator height={spacing.md} />
            <RowTextDetail>
              <Center>
                <QRCode value={vaccine.barCode} />
              </Center>
            </RowTextDetail>
          </Content>
        </Shadow>
        <Separator height={spacing.lg} />
      </ScrollView>
    </Container>
  );
};

export default VaccineDetail;
