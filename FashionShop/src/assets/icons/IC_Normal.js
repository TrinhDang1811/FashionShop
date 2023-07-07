import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {memo} from 'react';
const SvgComponent = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={31}
    height={31}
    fill="none">
    <Path
      fill={props.border||"#E0CFBA"}
      d="M15.396.917c-8.272 0-15 6.728-15 15 0 8.271 6.728 15 15 15 8.271 0 15-6.729 15-15 0-8.272-6.729-15-15-15Zm0 2.5a12.48 12.48 0 0 1 12.5 12.5 12.48 12.48 0 0 1-12.5 12.5 12.48 12.48 0 0 1-12.5-12.5 12.48 12.48 0 0 1 12.5-12.5Zm-5.625 7.5a1.875 1.875 0 1 0 0 3.75 1.875 1.875 0 0 0 0-3.75Zm11.25 0a1.875 1.875 0 1 0 0 3.75 1.875 1.875 0 0 0 0-3.75Zm-12.11 8.75-2.148 1.25c1.728 2.983 4.941 5 8.633 5 3.691 0 6.904-2.017 8.633-5l-2.149-1.25c-1.299 2.24-3.701 3.75-6.484 3.75-2.784 0-5.186-1.51-6.485-3.75Z"
    />
  </Svg>
);
const Memo = memo(SvgComponent);
export default Memo;
