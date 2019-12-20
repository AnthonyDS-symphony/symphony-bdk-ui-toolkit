import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { withTheme } from 'styled-components';
import PropTypes from 'prop-types';
import { ChartCanvas } from 'react-stockcharts';
import { last } from 'react-stockcharts/lib/utils';
import {
  CrossHairCursor,
} from 'react-stockcharts/lib/coordinates';
import { useDebouncedCallback } from 'use-debounce';
import { HoverTooltip } from 'react-stockcharts/lib/tooltip';
import { Label } from 'react-stockcharts/lib/annotation';
import { darken } from 'polished';
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale';
import Loader from '../../../base/loader';
import { ChartBackground, LoadingContainer } from '../helpers/themes';

const ChartBuilder = withTheme(({
  theme, results, width, height, ratio = 1,
  hasGrid, clampType, hasEdgeIndicator,
  tooltipContent, mouseMoveEvent, hasCrossHair,
  hasZoom, margin, hasOHLCTooltip,
  title, fontFamily, children,
}) => {
  const [gridCoordinates, setGridCoordinates] = useState({ xGrid: {}, yGrid: {} });
  const [suffix, setSuffix] = useState(0);

  	const xScaleProvider = discontinuousTimeScaleProvider
    .inputDateAccessor((d) => d.date);
  const {
    data,
    xScale,
    xAccessor,
    displayXAccessor,
  } = xScaleProvider(results);


  const start = xAccessor(last(data));
  const end = xAccessor(data[Math.max(0, data.length - 150)]);
  const xExtents = [start, end];


  const resetZoom = useCallback(() => {
    setSuffix(suffix + 1);
  });

  useEffect(() => {
    if (hasGrid) {
      setGridCoordinates({
        xGrid: {
          innerTickSize: -1 * (height - (margin.top + margin.bottom)),
          tickStrokeOpacity: 0.2,
          tickStrokeDasharray: 'Dot',
        },
        yGrid: {
          innerTickSize: -1 * (width - (margin.right + margin.left)),
          tickStrokeOpacity: 0.2,
          tickStrokeDasharray: 'Dot',
        },
      });
    } else {
      setGridCoordinates({
        xGrid: {},
        yGrid: {},
      });
    }
  }, [width, height, hasGrid, theme]);

  const CanvasRef = useRef();

  return (
    <ChartCanvas
      padding={{left: 0, right: 100}}
      clip={false}
      ref={CanvasRef}
      ratio={ratio}
      height={height}
      width={width}
      margin={margin}
      type="svg"
      seriesName={`MSFT_${suffix}`}
      data={data}
      xExtents={xExtents}
      xScale={xScale}
      xAccessor={xAccessor}
      displayXAccessor={displayXAccessor}
      mouseMoveEvent={mouseMoveEvent}
      panEvent={hasZoom.panEvent}
      zoomEvent={hasZoom.enabled}
      clamp={clampType}
    >
      {children({
        width,
        height,
        ratio,
        gridCoordinates,
        data,
        zoomEnabled: hasZoom.enabled,
        hasEdgeIndicator,
        resetZoom,
        fontFamily,
        hasOHLCTooltip,
      })}
      {tooltipContent && (
        <HoverTooltip
          bgFill={theme.colors.oldprimary_400}
          fontFill={darken(0.7, theme.colors.oldprimary_100)}
          tooltipContent={tooltipContent}
          fontFamily={fontFamily}
          opacity={0.8}
          stroke="none"
          fontSize={14}
        />
      )}
      {hasCrossHair
      && (
      <CrossHairCursor
        stroke={theme.colors.secondary_400}
        opacity={0.8}
      />
      ) }
      {title && (
      <Label
        x={(width - margin.left - margin.right) / 2}
        y={50}
        fontFamily={fontFamily}
        fill={theme.colors.grey_600}
        fontSize="30"
        opacity={0.5}
        text={title}
      />
      )}
    </ChartCanvas>
  );
});

ChartBuilder.defaultProps = {
  hasGrid: false,
  hasCrossHair: false,
  hasEdgeIndicator: false,
  tooltipContent: null,
  mouseMoveEvent: true,
  hasOHLCTooltip: false,
  hasZoom: {
    panEvent: false,
    enabled: false,
  },
  clampType: null,
  margin: {
    left: 0,
    right: 50,
    top: 30,
    bottom: 30,
  },
  title: null,
  shownWindow: 100,
  fontFamily: '"SymphonyLato", "Lato", "Segoe UI", "Helvetica Neue", "Verdana", "Arial", sans-serif',
};

ChartBuilder.propTypes = {
  hasGrid: PropTypes.bool,
  hasCrossHair: PropTypes.bool,
  hasEdgeIndicator: PropTypes.bool,
  tooltipContent: PropTypes.func,
  mouseMoveEvent: PropTypes.bool,
  hasOHLCTooltip: PropTypes.bool,
  hasZoom: PropTypes.shape({
    panEvent: PropTypes.bool,
    enabled: PropTypes.bool,
  }),
  clampType: PropTypes.oneOf([
    'mouseBasedZoomAnchor',
    'lastVisibleItemBasedZoomAnchor',
    'rightDomainBasedZoomAnchor',
    null,
  ]),
  margin: PropTypes.shape({
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
    bottom: PropTypes.number,
  }),
  shownWindow: PropTypes.number,
  title: PropTypes.string,
  fontFamily: PropTypes.string,
};

const ChartContainer = ({
  loading, data, children, margin, ...rest
}) => {
  const mRef = useRef();
  const [size, setSize] = useState(null);

  const [setDimensions] = useDebouncedCallback(
    () => {
      if (mRef.current) {
        setSize({
          width: mRef.current.offsetWidth,
          height: mRef.current.offsetHeight,
        });
      }
    },
    // delay in ms
    100,
  );

  useEffect(() => {
    setDimensions();
    window.addEventListener('resize', setDimensions);
    return () => window.removeEventListener('resize', setDimensions);
  }, [mRef.current]);

  const Memoized = useMemo(() => {
    if (loading || !data || !data.length || !size) {
      return (
        <LoadingContainer>
          <Loader />
        </LoadingContainer>
      );
    }
    return (
      <ChartBuilder
        results={data}
        width={size.width}
        height={size.height}
        margin={margin}
        {...rest}
      >
        {children}
      </ChartBuilder>
    );
  }, [data, loading, size, mRef, children]);
  const width = size ? size.width : 0;
  const height = size ? size.height : 0;
  return (
    <div style={{ width: '100%', height: '100%' }} ref={mRef}>
      <ChartBackground width={width} height={height} margin={margin} />
      {Memoized}
    </div>
  );
};


ChartContainer.defaultProps = {
  loading: false,
  margin: {
    left: 0,
    right: 50,
    top: 30,
    bottom: 30,
  },
};

ChartContainer.propTypes = {
  data: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool,
  margin: PropTypes.shape({
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
    bottom: PropTypes.number,
  }),
};

export default ChartContainer;
