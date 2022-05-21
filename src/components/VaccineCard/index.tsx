/* eslint-disable @typescript-eslint/no-unused-vars */
import {format, isBefore} from 'date-fns';
import React, {useMemo} from 'react';
import {Pressable, View} from 'react-native';
import {useTheme} from 'styled-components';
import useConvertDose from '~/hooks/useConvertDose';
import Icon from '../Icon';
import Separator from '../Separator';
import Shadow from '../Shadow';
import Text from '../Text';
import {BadgeLeft, Chip, ChipWrap, Container, VaccineDate} from './styles';
import {VaccineCardProps} from './types';

const VaccineCard = ({date, shot, title, onPress}: VaccineCardProps) => {
  const {colors} = useTheme();

  const isBeforeToday = useMemo(() => {
    return isBefore(new Date(date), new Date());
  }, [date]);

  const formattedDate = useMemo(() => {
    return format(new Date(date), 'dd/MM/yy');
  }, [date]);

  const dose = useConvertDose({shot});

  return (
    <Shadow onPress={onPress}>
      <Container>
        <BadgeLeft
          color={isBeforeToday ? colors.lightGreen.main : colors.orange.main}
        />
        <View>
          <Text typography="body2">{title}</Text>
          <Separator height={18} />
          <ChipWrap>
            <Chip color={dose.color}>
              <Text color="background">{dose.title}</Text>
            </Chip>
          </ChipWrap>
        </View>
        <VaccineDate>
          <Icon icon="calendar" />
          <Separator width={12} />
          <Text>{formattedDate}</Text>
        </VaccineDate>
      </Container>
    </Shadow>
  );
};

export default VaccineCard;
