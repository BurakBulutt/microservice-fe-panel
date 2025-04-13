export const usersColumnsData = [
  {
    accessor: "firstName",
    type: "text",
    priority: 0
  },
  {
    accessor: "lastName",
    type: "text",
    priority: 1
  },
  {
    accessor: "createdTimestamp",
    type: "date",
    priority: 2
  },
  {
    accessor: "username",
    type: "text",
    priority: 3
  },
  {
    accessor: "email",
    type: "text",
    priority: 4
  },
  {
    accessor: "emailVerified",
    type: "boolean",
    booleanTrue: "verified",
    booleanFalse: "notVerified",
    priority: 5
  },
  {
    accessor: "enabled",
    type: "boolean",
    booleanTrue: "active",
    booleanFalse: "passive",
    priority: 6
  }
];

export const contentsColumnsData = [
  {
    header: "image",
    accessor: "photoUrl",
    type: "image",
    priority: 0
  },
  {
    accessor: "name",
    type: "text",
    priority: 1
  },
  {
    accessor: "startDate",
    type: "date",
    priority: 2
  },
  {
    accessor: "slug",
    type: "text",
    priority: 3
  },
  {
    header: "category",
    accessor: "categories",
    type: "list",
    listColor: "brand",
    nameLabel: "name",
    priority: 4
  },
  {
    accessor: "type",
    type: "enum",
    enumType: "contentType",
    priority: 5
  },
  {
    accessor: "likeCount.likeCount",
    type: "number",
    priority: 6
  },
  {
    accessor: "likeCount.dislikeCount",
    type: "number",
    priority: 7
  },
];

export const mediaColumnsData = [
  {
    accessor: "name",
    type: "text",
    priority: 0
  },
  {
    accessor: "description",
    type: "text",
    priority: 1
  },
  {
    header: "episodeNumber",
    accessor: "count",
    type: "number",
    priority: 2
  },
  {
    accessor: "publishDate",
    type: "date",
    priority: 3
  },
  {
    accessor: "slug",
    type: "text",
    priority: 4
  },
  {
    accessor: "likeCount.likeCount",
    type: "number",
    priority: 5
  },
  {
    accessor: "likeCount.dislikeCount",
    type: "number",
    priority: 6
  },
  {
    accessor: "numberOfViews",
    type: "number",
    priority: 7
  }
];

export const commentColumnsData = [
  {
    accessor: "type",
    type: "text",
    priority: 0
  },
  {
    accessor: "content",
    type: "modal",
    priority: 1
  },
  {
    accessor: "user",
    type: "modal",
    priority: 2
  },
  {
    accessor: "parent",
    type: "modal",
    priority: 3
  },
  {
    header: "replyList",
    accessor: "commentList",
    type: "modal",
    priority: 4
  },
  {
    accessor: "likeCount.likeCount",
    type: "number",
    priority: 5
  },
  {
    accessor: "likeCount.dislikeCount",
    type: "number",
    priority: 6
  }
];

export const categoryColumnsData = [
  {
    accessor: "name",
    type: "text",
    priority: 0
  },
  {
    accessor: "description",
    type: "text",
    priority: 1
  },
  {
    accessor: "slug",
    type: "text",
    priority: 2
  }
];
