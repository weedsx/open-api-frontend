// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** addUserInterface POST /api/user-interface/add */
export async function addUserInterfaceUsingPOST(
  body: API.UserInterfaceAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponselong>('/api/user-interface/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteUserInterface POST /api/user-interface/delete */
export async function deleteUserInterfaceUsingPOST(
  body: API.IdRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseboolean>('/api/user-interface/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getUserInterfaceById GET /api/user-interface/get */
export async function getUserInterfaceByIdUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserInterfaceByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseUserInterfaceCount>('/api/user-interface/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listUserInterface GET /api/user-interface/list */
export async function listUserInterfaceUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listUserInterfaceUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListUserInterfaceCount>('/api/user-interface/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** pageUserInterface GET /api/user-interface/page */
export async function pageUserInterfaceUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageUserInterfaceUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageUserInterfaceCount>('/api/user-interface/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** updateUserInterface POST /api/user-interface/update */
export async function updateUserInterfaceUsingPOST(
  body: API.UserInterfaceUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseboolean>('/api/user-interface/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
