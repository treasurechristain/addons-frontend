/* @flow */
import * as React from 'react';
import { compose } from 'redux';

import AddonTitle from 'amo/components/AddonTitle';
import Link from 'amo/components/Link';
import RatingsByStar from 'amo/components/RatingsByStar';
import translate from 'core/i18n/translate';
import { getAddonIconUrl } from 'core/imageUtils';
import Card from 'ui/components/Card';
import LoadingText from 'ui/components/LoadingText';
import Rating from 'ui/components/Rating';
import type { AddonType } from 'core/types/addons';
import type { I18nType } from 'core/types/i18n';
import { roundToOneDigit } from 'amo/components/AddonMeta';
import { getAddonURL } from 'amo/utils';

import './styles.scss';

type Props = {|
  addon: AddonType | null,
  headerText: string,
|};

type InternalProps = {|
  ...Props,
  i18n: I18nType,
|};

export const AddonSummaryCardBase = ({
  addon,
  headerText,
  i18n,
}: InternalProps) => {
  const addonUrl = addon ? getAddonURL(addon.slug) : '';
  const iconUrl = getAddonIconUrl(addon);
  const iconImage = (
    <img
      className="AddonSummaryCard-header-icon-image"
      src={iconUrl}
      alt={i18n.gettext('Add-on icon')}
    />
  );

  const metaHeader = (
    <div className="AddonSummaryCard-header">
      <div className="AddonSummaryCard-header-icon">
        {addon ? <Link to={addonUrl}>{iconImage}</Link> : iconImage}
      </div>
      <div className="AddonSummaryCard-header-text">
        <h1 className="visually-hidden">{headerText}</h1>
        <AddonTitle addon={addon} linkToAddon />
      </div>
    </div>
  );

  let addonAverage;
  if (addon && addon.ratings) {
    const roundedAverage = roundToOneDigit(addon.ratings.average);
    addonAverage = i18n.sprintf(
      // eslint-disable-next-line max-len
      // translators: roundedAverage is a number rounded to one digit, such as 4.5 in English or ٤٫٧ in Arabic.
      i18n.ngettext(
        '%(rating)s Star out of 5',
        '%(rating)s Stars out of 5',
        roundedAverage,
      ),
      { rating: i18n.formatNumber(roundedAverage) },
    );
  }

  return (
    <Card header={metaHeader} className="AddonSummaryCard">
      <div className="AddonSummaryCard-overallRatingStars">
        <Rating
          rating={addon && addon.ratings && addon.ratings.average}
          readOnly
          yellowStars
        />
        <div className="AddonSummaryCard-addonAverage">
          {addon ? addonAverage : <LoadingText minWidth={20} />}
        </div>
      </div>
      <RatingsByStar addon={addon} />
    </Card>
  );
};

const AddonSummaryCard: React.ComponentType<Props> = compose(translate())(
  AddonSummaryCardBase,
);

export default AddonSummaryCard;
