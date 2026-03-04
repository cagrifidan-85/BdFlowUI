import { Alert, Box, Button, Chip, CircularProgress, IconButton, Paper, Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { NavigationBar } from "./navigationBar";
import img1 from "../../../sliderContent/1.jpg";
import img2 from "../../../sliderContent/2.jpg";
import img3 from "../../../sliderContent/3.jpg";
import styles from "./style.module.scss";
import CalculateProduct from "./calculateProduct";
import React, { useEffect, useMemo, useState } from "react";
import { t } from "i18next";
import { useGetAllProductsQuery, useGetFiltersQuery } from "@apis/products";
import { useGetImagesByContainsQuery } from "@apis/images";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useGetSiteSettingsQuery } from "@apis/siteSettings";
import { CampaignContentItem, NewsFeedItem, VisibilityRule } from "@app-types/siteSettings";

const FALLBACK_SEGMENTS = ["public"];

const parseDateSafely = (value?: string | null) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const isWithinSchedule = (startAt?: string | null, endAt?: string | null) => {
  const now = new Date();
  const startDate = parseDateSafely(startAt);
  const endDate = parseDateSafely(endAt);

  if (startDate && now < startDate) {
    return false;
  }

  if (endDate && now > endDate) {
    return false;
  }

  return true;
};

const matchesSegments = (ruleSegments?: string[], visitorSegments: string[] = FALLBACK_SEGMENTS) => {
  if (!ruleSegments || ruleSegments.length === 0) {
    return true;
  }

  return ruleSegments.some((segment) => visitorSegments.includes(segment.trim()));
};

const isVisibilityRuleActive = (rule?: VisibilityRule, visitorSegments: string[] = FALLBACK_SEGMENTS) => {
  if (!rule) {
    return true;
  }

  switch (rule.mode) {
    case "always":
      return true;
    case "segments":
      return matchesSegments(rule.segments, visitorSegments);
    case "schedule":
      return isWithinSchedule(rule.startAt, rule.endAt);
    default:
      return true;
  }
};

const collectActiveNewsItems = (items: NewsFeedItem[] = [], visitorSegments: string[] = FALLBACK_SEGMENTS) => {
  return items
    .filter((item) => item.visible)
    .filter((item) => matchesSegments(item.segments, visitorSegments))
    .filter((item) => isWithinSchedule(item.startAt, item.endAt))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));
};

export const Body = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<string | undefined>()
  const [selectedEnvironment, setSelectedEnvironment] = useState<string | undefined>()
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [scrollPosition, setScrollPosition] = useState(500)
  const [showSelection, setShowSelection] = useState(false)
  const [campaignDismissed, setCampaignDismissed] = useState(false)
  const [newsSectionDismissed, setNewsSectionDismissed] = useState(false)

  const visitorSegments = useMemo(() => FALLBACK_SEGMENTS, [])

  const { data: products, isError, isLoading } = useGetAllProductsQuery()
  const { data: filters, isError: isFiltersError, isLoading: isFiltersLoading } = useGetFiltersQuery()
  const { data: sliderData, isLoading: isSliderLoading, isError: isSliderError } = useGetImagesByContainsQuery("slider")
  const { data: siteSettings } = useGetSiteSettingsQuery()
  const campaignPopup = siteSettings?.campaignPopup

  const normalizedCampaignItems = useMemo(() => {
    if (!campaignPopup?.items) {
      return [] as CampaignContentItem[]
    }

    return (campaignPopup.items ?? [])
      .map((item, index) => ({
        ...item,
        itemId: item.itemId || `campaign-${index}`,
      }))
      .filter((item) => Boolean(item.title?.trim() || item.message?.trim() || item.ctaLabel?.trim() || item.ctaUrl?.trim()))
  }, [campaignPopup])

  const fallbackCampaignItems: CampaignContentItem[] = campaignPopup
    ? [
        {
          itemId: "campaign-default",
          title: campaignPopup.title?.trim() || t('body.campaign.defaultTitle'),
          message: campaignPopup.message?.trim() || t('body.campaign.defaultMessage'),
          ctaLabel: campaignPopup.ctaLabel ?? "",
          ctaUrl: campaignPopup.ctaUrl ?? "",
        },
      ]
    : []

  const campaignItemsToRender = normalizedCampaignItems.length ? normalizedCampaignItems : fallbackCampaignItems
  const hasCampaignItems = campaignItemsToRender.length > 0

  const remoteSliderItems = (sliderData?.images ?? []).map((image) => ({ id: image.id, img: image.url }))
  const fallbackSliderItems = [
    { id: "fallback-1", img: img1 },
    { id: "fallback-2", img: img2 },
    { id: "fallback-3", img: img3 },
  ]
  const carouselItems = remoteSliderItems.length ? remoteSliderItems : fallbackSliderItems

  const shouldShowCampaign = useMemo(() => {
    if (!campaignPopup?.enabled || campaignDismissed) {
      return false
    }

    if (!hasCampaignItems) {
      return false
    }

    return isVisibilityRuleActive(campaignPopup.visibility, visitorSegments)
  }, [campaignPopup, campaignDismissed, visitorSegments, hasCampaignItems])

  const activeNewsItems = useMemo(() => {
    if (!siteSettings?.newsFeed?.enabled) {
      return [] as NewsFeedItem[]
    }

    return collectActiveNewsItems(siteSettings.newsFeed.items, visitorSegments)
  }, [siteSettings, visitorSegments])

  const visibleNewsItems = activeNewsItems

  const hasVisibleNewsItems = visibleNewsItems.length > 0
  const shouldShowNewsFeed = hasVisibleNewsItems && !newsSectionDismissed

  const handleDismissNewsSection = () => {
    setNewsSectionDismissed(true)
  }

  useEffect(() => {
    if (scrollPosition > 0) {
      setTimeout(() => window.scrollTo(0, scrollPosition), 5);

      setScrollPosition(0);
    }
  }, [scrollPosition]);

  if (isLoading || isFiltersLoading) {
    return <Box className={styles.products} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
      <CircularProgress />
    </Box>
  }

  if (isError || isFiltersError) {
    return <Box className={styles.products} p={3}>
      <Alert severity="warning">
        {t('admin.products.error.loading')}
      </Alert>
    </Box>
  }

  return (
    <Box className={styles.body} >

      <NavigationBar />
      <Box className={styles.body__slider}>
        {!showSelection && (
          <>
            {isSliderLoading && !remoteSliderItems.length ? (
              <Box className={styles.body__sliderLoader}>
                <CircularProgress size={32} />
              </Box>
            ) : (
              <Carousel autoPlay duration={2} animation="slide" stopAutoPlayOnHover>
                {carouselItems.map((item) => (
                  <Paper key={item.id}>
                    <img src={item.img} height={300} width="100%" />
                  </Paper>
                ))}
              </Carousel>
            )}
            {isSliderError && (
              <Alert severity="info" className={styles.body__sliderAlert}>
                {t('body.slider.error')}
              </Alert>
            )}
            {!isSliderLoading && !remoteSliderItems.length && !isSliderError && (
              <Alert severity="info" className={styles.body__sliderAlert}>
                {t('body.slider.empty')}
              </Alert>
            )}
          </>
        )}
      </Box>

      <Box className={styles.body__content}>
        <Box className={styles.body__contentSection}>
          {shouldShowCampaign && campaignPopup && (
            <Paper className={styles.body__campaign} elevation={0}>
              <Box className={styles.body__campaignTop}>
                <Typography className={styles.body__campaignEyebrow}>{t('body.campaign.label')}</Typography>
                <IconButton
                  aria-label={t('body.campaign.dismiss')}
                  size="small"
                  onClick={() => setCampaignDismissed(true)}
                  className={styles.body__dismissButton}
                >
                  <CloseRoundedIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box className={styles.body__campaignList}>
                {campaignItemsToRender.map((item) => {
                  const primaryCtaUrl = item.ctaUrl || campaignPopup.ctaUrl
                  const primaryCtaLabel = item.ctaLabel?.trim() || campaignPopup.ctaLabel?.trim() || t('body.campaign.ctaFallback')

                  return (
                    <Box key={item.itemId} className={styles.body__campaignCard}>
                      <Typography className={styles.body__campaignTitle} variant="h5" component="h3">
                        {item.title?.trim() || t('body.campaign.defaultTitle')}
                      </Typography>
                      <Typography className={styles.body__campaignMessage} variant="body1">
                        {item.message?.trim() || t('body.campaign.defaultMessage')}
                      </Typography>
                      {primaryCtaUrl && (
                        <Box className={styles.body__campaignActions}>
                          <Button
                            variant="contained"
                            color="primary"
                            component="a"
                            href={primaryCtaUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {primaryCtaLabel}
                          </Button>
                        </Box>
                      )}
                    </Box>
                  )
                })}
              </Box>
            </Paper>
          )}

          {shouldShowNewsFeed && (
            <Box className={styles.body__newsSection}>
              <Box className={styles.body__newsHeader}>
                <Box className={styles.body__newsHeaderContent}>
                  <Typography className={styles.body__newsTitle} component="h3">
                    {t('body.newsFeed.title')}
                  </Typography>
                  <Typography className={styles.body__newsSubtitle} variant="body2">
                    {t('body.newsFeed.subtitle')}
                  </Typography>
                </Box>
                <IconButton
                  aria-label={t('body.newsFeed.dismiss')}
                  size="small"
                  onClick={handleDismissNewsSection}
                  className={styles.body__dismissButton}
                >
                  <CloseRoundedIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box className={styles.body__newsList}>
                {visibleNewsItems.map((item) => (
                  <Paper key={item.itemId} className={styles.body__newsCard} elevation={0}>
                    <Box className={styles.body__newsCardHeader}>
                      <Typography className={styles.body__newsCardTitle} variant="h6">
                        {item.title}
                      </Typography>
                      {item.pinned && (
                        <Box className={styles.body__newsCardControls}>
                          <Chip label={t('body.newsFeed.pinned')} size="small" color="warning" variant="filled" />
                        </Box>
                      )}
                    </Box>
                    <Typography className={styles.body__newsCardBody} variant="body2">
                      {item.body}
                    </Typography>
                    {item.ctaUrl && (
                      <Box className={styles.body__newsCardActions}>
                        <Button
                          variant="text"
                          color="primary"
                          component="a"
                          href={item.ctaUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item.ctaLabel || t('body.newsFeed.ctaFallback')}
                        </Button>
                      </Box>
                    )}
                  </Paper>
                ))}
              </Box>
            </Box>
          )}

          <Box className={styles.body__contentHeader}>
            <Box className={styles.body__contentTitle}>{t('body.select.product')}</Box>
            <Box className={styles.body__contentSubtitle}>
              {t('body.select.subtitle')}
            </Box>
          </Box>

          <Box className={styles.body__contentGrid}>
            <Box
              className={styles.body__contentCard}
              onClick={() => {
                setShowSelection(true);
                setTimeout(() => {
                  const element = document.querySelector('[data-sensor-selection]');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }}
              style={{ cursor: 'pointer' }}
            >
              <Box className={styles.body__contentCardIcon}>🎯</Box>
              <Box className={styles.body__contentCardTitle}>{t('body.card.easySelection.title')}</Box>
              <Box className={styles.body__contentCardText}>
                {t('body.card.easySelection.description')}
              </Box>
            </Box>

            <Box className={styles.body__contentCard} onClick={() => setShowSelection(false)}>
              <Box className={styles.body__contentCardIcon}>⚡</Box>
              <Box className={styles.body__contentCardTitle}>{t('body.card.quickResult.title')}</Box>
              <Box className={styles.body__contentCardText}>
                {t('body.card.quickResult.description')}
              </Box>
            </Box>

            <Box className={styles.body__contentCard} onClick={() => setShowSelection(false)}>
              <Box className={styles.body__contentCardIcon}>🔧</Box>
              <Box className={styles.body__contentCardTitle}>{t('body.card.technicalSupport.title')}</Box>
              <Box className={styles.body__contentCardText}>
                {t('body.card.technicalSupport.description')}
              </Box>
            </Box>

            <Box className={styles.body__contentCard} onClick={() => setShowSelection(false)}>
              <Box className={styles.body__contentCardIcon}>✓</Box>
              <Box className={styles.body__contentCardTitle}>{t('body.card.qualityAssurance.title')}</Box>
              <Box className={styles.body__contentCardText}>
                {t('body.card.qualityAssurance.description')}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {products && <Box data-sensor-selection>
        <CalculateProduct products={products} filters={filters} onSelectMaterial={setSelectedMaterial} onSelectEnvironment={setSelectedEnvironment} onSelectProduct={setSelectedProduct} isSelectionActive={showSelection} onSelectionActive={setShowSelection} material={selectedMaterial} environment={selectedEnvironment} />
      </Box>
      }

    </Box>
  );
};
export default Body;
