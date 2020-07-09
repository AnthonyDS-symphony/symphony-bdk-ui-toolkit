import React, { useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  ButtonContainer,
  ButtonText,
  MonthButton,
} from './theme';

function Year({ year, onClick }) {
  const yearRef = useRef(null);

  if (!year) {
    return <div />;
  }

  return (
    <ButtonContainer>
      <MonthButton
        onClick={() => onClick(year)}
        type="button"
        ref={yearRef}
        // isSelectedStartOrEnd={isSelectedStartOrEnd}
        // isSelected={isSelected}
      >
        <ButtonText
          // isSelected={isSelectedStartOrEnd || isSelected}
          size="small"
        >
          {year}
        </ButtonText>
      </MonthButton>
    </ButtonContainer>
  );
}

Year.propTypes = {
  year: PropTypes.number,
  onClick: PropTypes.func,
};

Year.defaultProps = {
  year: null,
  onClick: () => {}
};

export default Year;
