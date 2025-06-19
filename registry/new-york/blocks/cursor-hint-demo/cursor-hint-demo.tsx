import Cursor, { CursorContextProvider } from '@/registry/new-york/ui/cursor-hint'
import { Button } from '../../ui/button'

export default function CursorHintDemo() {
  return (
    <CursorContextProvider>
      <div>
        <Button>Info</Button>
        <Cursor containerSelector="#pointer-hint-demo" />
      </div>
    </CursorContextProvider>
  )
}
