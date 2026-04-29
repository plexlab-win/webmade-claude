/**
 * Google Apps Script — 클라이언트 설문 폼 수신기
 *
 * [배포 방법]
 * 1. Google Sheets 열기 → 확장 프로그램 → Apps Script
 * 2. 이 코드를 전체 붙여넣기 후 저장 (Ctrl+S)
 * 3. 우측 상단 '배포' → '배포 관리' → ✏️ 편집
 * 4. 버전: '새 버전' 선택 후 '배포' 클릭
 *    (URL은 변경되지 않습니다)
 *
 * [시트 구조]
 * 스크립트가 최초 실행 시 'Leads'라는 이름의 시트를 자동 생성하고
 * 헤더 행을 삽입합니다. 기존 시트가 있으면 그대로 사용합니다.
 */

const SHEET_NAME = 'Leads';

const HEADERS = [
  '제출일시',
  '회사명',
  '서비스 소개',
  '타겟 고객',
  '제작 목적',
  '목적(기타)',
  '참고사이트1',
  '참고사이트2',
  '브랜드 컬러',
  '피하고 싶은 스타일',
  '메뉴 구성',
  '필요 기능',
  '기능(기타)',
  '관리자 페이지',
  '로고 자료',
  '이미지 자료',
  '텍스트 자료',
  '희망 오픈일',
  '예산 범위',
  '예산(기타)',
];

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function appendToSheet(data) {
  const sheet = getOrCreateSheet();
  sheet.appendRow([
    data.submittedAt  || '',
    data.companyName  || '',
    data.serviceDesc  || '',
    data.target       || '',
    data.purpose      || '',
    data.purposeOther || '',
    data.ref1         || '',
    data.ref2         || '',
    data.brandColor   || '',
    data.avoidStyle   || '',
    data.menus        || '',
    data.features     || '',
    data.featureOther || '',
    data.adminNeed    || '',
    data.logoAsset    || '',
    data.imageAsset   || '',
    data.textAsset    || '',
    data.deadline     || '',
    data.budget       || '',
    data.budgetOther  || '',
  ]);
}

// 메인 수신 함수 — GET 파라미터로 데이터를 수신합니다.
function doGet(e) {
  try {
    if (!e.parameter.data) {
      return ContentService
        .createTextOutput(JSON.stringify({ result: 'ok' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const data = JSON.parse(e.parameter.data);
    appendToSheet(data);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// POST 폴백 (직접 호출 시 대비)
function doPost(e) {
  try {
    const raw = (e.parameter && e.parameter.data) || e.postData.contents;
    const data = JSON.parse(raw);
    appendToSheet(data);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
