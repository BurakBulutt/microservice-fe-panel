export const usersColumnsData = [
  {
    accessor: "firstName",
    type: "text"
  },
  {
    accessor: "lastName",
    type: "text"
  },
  {
    accessor: "createdTimestamp",
    type: "date"
  },
  {
    accessor: "username",
    type: "text"
  },
  {
    accessor: "email",
    type: "text"
  },
  {
    accessor: "emailVerified",
    type: "boolean",
    booleanTrue: "verified",
    booleanFalse: "notVerified"
  },
  {
    accessor: "enabled",
    type: "boolean",
    booleanTrue: "active",
    booleanFalse: "passive"
  }
];

export const contentsColumnsData = [
  {
    Header: "IMAGE",
    accessor: "photoUrl",
    type: "image"
  },
  {
    Header: "NAME",
    accessor: "name",
    type: "text"
  },
  {
    Header: "START DATE",
    accessor: "startDate",
    type: "date"
  },
  {
    Header: "SLUG",
    accessor: "slug",
    type: "text"
  },
  {
    Header: "CONTENT TYPE",
    accessor: "type",
    type: "text"
  },
  {
    Header: "LIKE",
    accessor: "likeCount.likeCount",
    type: "number"
  },
  {
    Header: "DISLIKE",
    accessor: "likeCount.dislikeCount",
    type: "number"
  },
];

export const mediaColumnsData = [
  {
    Header: "NAME",
    accessor: "name",
    type: "text"
  },
  {
    Header: "DESCRIPTION",
    accessor: "description",
    type: "text"
  },
  {
    Header: "COUNT",
    accessor: "count",
    type: "number"
  },
  {
    Header: "PUBLISH DATE",
    accessor: "publishDate",
    type: "date"
  },
  {
    Header: "SLUG",
    accessor: "slug",
    type: "text"
  },
  {
    Header: "LIKE",
    accessor: "likeCount.likeCount",
    type: "number"
  },
  {
    Header: "DISLIKE",
    accessor: "likeCount.dislikeCount",
    type: "number"
  },
  {
    Header: "VIEWS",
    accessor: "numberOfViews",
    type: "number"
  }
];

export const commentColumnsData = [
  {
    accessor: "type",
    type: "text"
  },
  {
    accessor: "content",
    type: "modal"
  },
  {
    accessor: "user",
    type: "modal"
  },
  {
    accessor: "parent",
    type: "modal"
  },
  {
    accessor: "commentList",
    type: "modal"
  },
  {
    accessor: "likeCount.likeCount",
    type: "number"
  },
  {
    accessor: "likeCount.dislikeCount",
    type: "number"
  }
];

export const categoryColumnsData = [
  {
    accessor: "name",
    type: "text"
  },
  {
    accessor: "description",
    type: "text"
  },
  {
    accessor: "slug",
    type: "text"
  }
];