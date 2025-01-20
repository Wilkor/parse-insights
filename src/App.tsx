import React, { useState, useEffect } from 'react';
import { Container, Grid, AppBar, Toolbar, Typography, Box, Button, CircularProgress } from '@mui/material';
import CampaignsList from './components/CampaignsList';
import InsightsChart from './components/InsightsChart';
import logo from './image/logo_parse.png';

interface AppProps {
    eventCaller: string;
}

// Declaração global para o Facebook SDK
declare global {
    interface Window {
        FB: any;
    }
}

const App: React.FC<AppProps> = ({ eventCaller }) => {
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
    const [pageAccessToken, setPageAccessToken] = useState<string | null>(() => {
        return localStorage.getItem('pageAccessToken');
    });
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Load the Facebook SDK asynchronously
        (function (d: Document, s: string, id: string) {
            const js: HTMLScriptElement = d.createElement(s) as HTMLScriptElement;
            const fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk.js';
            if (fjs.parentNode) {
                fjs.parentNode.insertBefore(js, fjs);
            }
            js.onload = () => {
                if (window.FB) {
                    window.FB.init({
                        appId: '1154848712403630',
                        cookie: true,
                        xfbml: true,
                        version: 'v20.0',
                    });
                    window.FB.AppEvents.logPageView();
                }
            };
        })(document, 'script', 'facebook-jssdk');

        // Extract access token from URL hash
        const extractTokenFromUrl = () => {
            const hash = window.location.hash;
            const params = new URLSearchParams(hash.replace('#', '?'));
            const token = params.get('access_token');

            if (token) {
                // Save the token in localStorage
                localStorage.setItem('pageAccessToken', token);

                // Update the state
                setPageAccessToken(token);
                console.log('Access Token:', token);

                // Remove the token from the URL
                window.history.replaceState(null, '', window.location.pathname);
            }

            // Finalize loading
            setLoading(false);
        };

        extractTokenFromUrl();
    }, []);

    const handleCampaignSelect = (campaignId: string) => {
        setSelectedCampaignId(campaignId);
    };

    const handleLogin = () => {
        const authUrl =
            'https://www.facebook.com/v20.0/dialog/oauth?' +
            'response_type=token&' +
            'display=popup&' +
            'client_id=1154848712403630&' +
            'redirect_uri=https://parse-insights-509f01aeb090.herokuapp.com/&' +
            'auth_type=rerequest&' +
            'scope=read_insights,ads_read';

        window.location.href = authUrl; // Redireciona para a URL de login
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }}>
                        {eventCaller !== 'blip-ai' ? (
                            <img src={logo} alt="Logo" style={{ height: 30 }} />
                        ) : (
                            <img src="https://lais.ai/images/lais-white.svg" alt="Logo" style={{ height: 25 }} />
                        )}
                    </Box>
                    <Typography variant="h6" component="div">
                        Insights
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container>
                {loading ? (
                    <CircularProgress />
                ) : pageAccessToken ? (
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <CampaignsList onSelect={handleCampaignSelect} pageAccessToken={pageAccessToken} />
                        </Grid>
                        <Grid item xs={12} md={8}>
                            {selectedCampaignId && (
                                <InsightsChart
                                    campaignId={selectedCampaignId}
                                    pageAccessToken={pageAccessToken}
                                />
                            )}
                        </Grid>
                    </Grid>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '50vh',
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: '16px', maxWidth: '300px' }}
                            onClick={handleLogin}
                        >
                            Entrar com Facebook
                        </Button>
                    </Box>
                )}
            </Container>
        </>
    );
};

export default App;
