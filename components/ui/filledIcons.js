import { Pause, Play } from 'lucide-react';
import Icon from './Icon';

/** Solid media-control glyphs: Lucide shapes filled with currentColor, drawn through <Icon>. */
export const PauseFilled = (props) => <Icon icon={Pause} fill="currentColor" {...props} />;
export const PlayFilled = (props) => <Icon icon={Play} fill="currentColor" {...props} />;
