import React, {
  useState, useRef, useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import Month from './Month';
import { CalendarBubble } from './theme';

const PortalBubble = (props) => {
  const {
    triggerClose,
    activeMonths,
    goToNextMonths,
    goToPreviousMonths,
    goToNextYear,
    goToPreviousYear,
    firstDayOfWeek,
    isRange,
    value,
    strategy,
    relatedWidth,
    customWeekdayLabels,
    textInputDateRef,
    hasYearDropdown,
    isYearPicker,
    setNumberOfMonths,
  } = props;
  const isUp = strategy && strategy.includes('ABOVE');
  const bubbleRef = useRef();
  const [initialHeight, setInitialHeight] = useState(0);
  const [currHeight, setCurrHeight] = useState(0);

  const [displayMonths, changeDisplayMonths] = useState(false);
  const [displayYears, changeDisplayYears] = useState(false);
  const [displayDays, changeDisplayDays] = useState(true);

  const onClickForMonths = () => {
    changeDisplayMonths(true);
    changeDisplayYears(false);
    changeDisplayDays(false);
  };

  const onClickForYears = () => {
    changeDisplayYears(true);
    changeDisplayMonths(false);
    changeDisplayDays(false);
  }

  const onClickForDays = () => {
    changeDisplayDays(true);
    changeDisplayMonths(false);
    changeDisplayYears(false);
  }


  useLayoutEffect(() => {
    if (!initialHeight) {
      setInitialHeight(bubbleRef.current.getBoundingClientRect().height);
    }
    setCurrHeight(bubbleRef.current.getBoundingClientRect().height);
  }, [activeMonths]);

  return (
    <CalendarBubble
      ref={bubbleRef}
      relatedShift={relatedWidth / 2}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
      size={activeMonths.length}
      out={triggerClose}
      isUp={isUp}
      heightDelta={initialHeight ? initialHeight - currHeight : 0}
    >
      {activeMonths.map((month, index) => (
        <Month
          goToNextMonths={
            index === activeMonths.length - 1 ? goToNextMonths : null
          }
          customWeekdayLabels={customWeekdayLabels}
          goToPreviousMonths={index === 0 ? goToPreviousMonths : null}
          goToNextYear={goToNextYear}
          goToPreviousYear={goToPreviousYear}
          key={`${month.year}-${month.month}`}
          year={month.year}
          month={month.month}
          singleDay={isRange ? null : value}
          firstDayOfWeek={firstDayOfWeek}
          textInputDateRef={textInputDateRef}
          hasYearDropdown={hasYearDropdown}
          isYearPicker={isYearPicker}
          displayDays={displayDays}
          displayMonths={displayMonths}
          displayYears={displayYears}
          onClickForDays={onClickForDays}
          onClickForMonths={onClickForMonths}
          onClickForYears={onClickForYears}
          setNumberOfMonths={setNumberOfMonths}
        />
      ))}
    </CalendarBubble>
  );
};

PortalBubble.propTypes = {
  value: PropTypes.object,
  isRange: PropTypes.bool,
  firstDayOfWeek: PropTypes.number,
  customWeekdayLabels: PropTypes.arrayOf(PropTypes.string),
  activeMonths: PropTypes.array.isRequired,
  triggerClose: PropTypes.bool,
  goToNextMonths: PropTypes.func.isRequired,
  goToPreviousMonths: PropTypes.func.isRequired,
  relatedWidth: PropTypes.number,
  strategy: PropTypes.string,
};
PortalBubble.defaultProps = {
  value: null,
  isRange: false,
  firstDayOfWeek: 0,
  customWeekdayLabels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  relatedWidth: 0,
  strategy: '',
  triggerClose: false,
};

export default PortalBubble;
