import styled from 'styled-components';

const getGridTemplateSize = ({ activeMonths = [] }) => {
  return activeMonths.length;
};

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(${getGridTemplateSize}, 200px);
`;