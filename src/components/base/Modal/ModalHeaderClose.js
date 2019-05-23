import React from 'react';
import { PropTypes } from 'prop-types';
import styled from 'styled-components';
import { GoX } from 'react-icons/go';
import { colors } from '../../../styles/colors';

export default function ModalHeaderClose(props) {
  const { onClose } = props;

  return (
    <ModalCloseBase>
      <GoX onClick={onClose} />
    </ModalCloseBase>
  );
}

ModalHeaderClose.propTypes = {
  onClose: PropTypes.func.isRequired,
};

const ModalCloseBase = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: ${colors.grey}
  &:hover {
    color: ${colors.darkgrey}
  }
`;
