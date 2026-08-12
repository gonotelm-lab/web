import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import GraphicEqOutlinedIcon from '@mui/icons-material/GraphicEqOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined'
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined'
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import type { StudioToolDefinition } from './types'

export const studioToolCatalog: StudioToolDefinition[] = [
  {
    id: 'audio-overview',
    title: '音频概览',
    description: '基于勾选来源生成音频概览任务',
    icon: GraphicEqOutlinedIcon,
    availability: 'available',
    actionId: 'generate-audio_overview',
    artifactKind: 'audio_overview',
    hasAdvancedConfig: true,
  },
  {
    id: 'video-overview',
    title: '视频概览',
    description: '即将支持',
    icon: VideocamOutlinedIcon,
    availability: 'coming-soon',
    hasAdvancedConfig: true,
  },
  {
    id: 'mind-map',
    title: '思维导图',
    description: '基于勾选来源生成思维导图',
    icon: AccountTreeOutlinedIcon,
    availability: 'available',
    actionId: 'generate-mindmap',
    artifactKind: 'mindmap',
    hasAdvancedConfig: true,
  },
  {
    id: 'report',
    title: '报告',
    description: '基于勾选来源生成报告',
    icon: MenuBookOutlinedIcon,
    availability: 'available',
    actionId: 'generate-report',
    artifactKind: 'report',
    hasAdvancedConfig: true,
  },
  {
    id: 'flashcard',
    title: '闪卡',
    description: '基于勾选来源生成闪卡',
    icon: StyleOutlinedIcon,
    availability: 'available',
    actionId: 'generate-flashcard',
    artifactKind: 'flashcard',
    hasAdvancedConfig: true,
  },
  {
    id: 'quiz',
    title: '测验',
    description: '基于勾选来源生成测验',
    icon: QuizOutlinedIcon,
    availability: 'available',
    actionId: 'generate-quiz',
    artifactKind: 'quiz',
    hasAdvancedConfig: true,
  },
  {
    id: 'info_graphic',
    title: '信息图',
    description: '基于勾选来源生成信息图',
    icon: ImageOutlinedIcon,
    availability: 'available',
    actionId: 'generate-info_graphic',
    artifactKind: 'info_graphic',
    hasAdvancedConfig: true,
  },
  {
    id: 'slide-deck',
    title: '幻灯片',
    description: '即将支持',
    icon: SlideshowOutlinedIcon,
    availability: 'coming-soon',
    hasAdvancedConfig: true,
  },
  {
    id: 'data-table',
    title: '数据表',
    description: '基于勾选来源生成数据表',
    icon: TableChartOutlinedIcon,
    availability: 'available',
    actionId: 'generate-data_table',
    artifactKind: 'data_table',
    hasAdvancedConfig: true,
  },
]
