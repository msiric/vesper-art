import React from "react";
import CommentCard from "../../components/CommentCard/index";
import loadingSkeletonStyles from "./styles";

// $TODO Just a blueprint, needs to be finished

const LoadingSkeleton = ({ count, type }) => {
  const classes = loadingSkeletonStyles();

  const elements = {
    artwork: (
      <ArtworkCard
        artwork={artwork}
        type={type}
        fixed={fixed}
        loading={loading}
      />
    ),
    user: <ProfileCard user={element} loading={false} />,
    comment: (
      <CommentCard
        artwork={artwork}
        comment={highlight.element}
        edits={edits}
        queryRef={queryRef}
        highlightRef={highlightRef}
        handleCommentClose={handleCommentClose}
        handleCommentEdit={handleCommentEdit}
        handlePopoverOpen={handlePopoverOpen}
        loading={loading}
      />
    ),
    notification: (
      <NotificationItem
        notification={notification}
        handleRedirectClick={handleRedirectClick}
        handleReadClick={handleReadClick}
        handleUnreadClick={handleUnreadClick}
      />
    ),
    collectible: (
      <ImageWrapper
        height={item.height}
        source={item.media ? item.media : item.cover}
        cover={item.cover}
        placeholder={item.dominant}
        loading={idx === index && loading ? true : false}
      />
    ),
  };

  const items = new Array(count).fill(elements[type]);

  return <Box>{items.map((item) => item)}</Box>;
};

export default LoadingSkeleton;
