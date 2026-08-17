import notoSansSc400 from '@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-400-normal.woff2?url'
import notoSansSc700 from '@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-700-normal.woff2?url'

let fontsReady: Promise<void> | null = null

/**
 * PPT 生成约定常用 Microsoft YaHei / Arial。
 * 浏览器缺字时会回退到站点 Geist，行宽/行距会明显跑偏。
 * 这里用 @font-face 别名：本地有雅黑则用本地，否则落到 Noto Sans SC。
 */
export function ensureSlidesPreviewFonts(): Promise<void> {
  if (fontsReady) {
    return fontsReady
  }

  fontsReady = new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve()
      return
    }

    const styleId = 'gonotelm-slides-preview-fonts'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
@font-face {
  font-family: 'Microsoft YaHei';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local('Microsoft YaHei'), local('微软雅黑'),
    url('${notoSansSc400}') format('woff2');
}
@font-face {
  font-family: 'Microsoft YaHei';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: local('Microsoft YaHei Bold'), local('微软雅黑'),
    url('${notoSansSc700}') format('woff2');
}
@font-face {
  font-family: '微软雅黑';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local('微软雅黑'), local('Microsoft YaHei'),
    url('${notoSansSc400}') format('woff2');
}
@font-face {
  font-family: '微软雅黑';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: local('微软雅黑'), local('Microsoft YaHei Bold'),
    url('${notoSansSc700}') format('woff2');
}
@font-face {
  font-family: 'Arial';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local('Arial'), local('Helvetica Neue'), local('Helvetica'),
    local('Liberation Sans'), local('Nimbus Sans');
}
@font-face {
  font-family: 'Arial';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: local('Arial Bold'), local('Helvetica Neue Bold'), local('Helvetica Bold'),
    local('Liberation Sans Bold'), local('Nimbus Sans Bold');
}
`
      document.head.appendChild(style)
    }

    const waitFonts =
      typeof document.fonts?.ready?.then === 'function'
        ? document.fonts.ready.then(() => undefined)
        : Promise.resolve()

    void waitFonts.finally(() => resolve())
  })

  return fontsReady
}
