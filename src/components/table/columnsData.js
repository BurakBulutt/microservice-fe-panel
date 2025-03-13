export const usersColumnsData = [
  {
    Header: "FIRST NAME",
    accessor: "firstName",
    type: "text"
  },
  {
    Header: "LAST NAME",
    accessor: "lastName",
    type: "text"
  },
  {
    Header: "CREATED DATE",
    accessor: "createdTimestamp",
    type: "date"
  },
  {
    Header: "USERNAME",
    accessor: "username",
    type: "text"
  },
  {
    Header: "EMAIL",
    accessor: "email",
    type: "text"
  },
  {
    Header: "EMAIL VERIFIED",
    accessor: "emailVerified",
    type: "boolean",
    booleanTrue: "DOĞRULANMIS",
    booleanFalse: "DOĞRULANMAMIS"
  },
  {
    Header: "IS ENABLE",
    accessor: "enabled",
    type: "boolean",
    booleanTrue: "AKTIF",
    booleanFalse: "PASIF"
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
    Header: "COMMENT TYPE",
    accessor: "type",
    type: "text"
  },
  {
    Header: "CONTENT",
    accessor: "content",
    type: "modal"
  },
  {
    Header: "USER",
    accessor: "user",
    type: "modal"
  },
  {
    Header: "PARENT",
    accessor: "parent",
    type: "modal"
  },
  {
    Header: "REPLY LIST",
    accessor: "commentList",
    type: "modal"
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
  }
];

export const categoryColumnsData = [
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
    Header: "SLUG",
    accessor: "slug",
    type: "text"
  }
];