import './App.css'
import { HeaderMenu } from './components/navbar/NavBar'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Demo } from './components/appshell/AppShell';
function App() {

  return (
    <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
      <Demo />
    </MantineProvider>
  )
}

export default App
