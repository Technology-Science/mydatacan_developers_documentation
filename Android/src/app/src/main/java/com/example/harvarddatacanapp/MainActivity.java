package com.example.harvarddatacanapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.amplifyframework.api.rest.RestOptions;
import com.amplifyframework.auth.cognito.AWSCognitoAuthSession;
import com.amplifyframework.core.Amplify;

public class MainActivity extends AppCompatActivity {

    String idToken;
    String accessToken;
    String refreshToken;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Amplify.Auth.fetchAuthSession(
                result -> Log.i("BeforeSignIn", result.toString()),
                error -> Log.e("BeforeSignIn", error.toString())
        );

        Button buttonOne = findViewById(R.id.buttonOne);
        buttonOne.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                login();
            }
        });

        Button buttonTwo = findViewById(R.id.buttonTwo);
        buttonTwo.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Amplify.Auth.fetchAuthSession(
                        result -> {
                            AWSCognitoAuthSession authSession = (AWSCognitoAuthSession) result;
                            idToken = authSession.getUserPoolTokens().getValue().getIdToken();
                            accessToken = authSession.getUserPoolTokens().getValue().getAccessToken();
                            refreshToken = authSession.getUserPoolTokens().getValue().getRefreshToken();

                            printAccessToken(accessToken);
                            Log.i("AfterSignIn", "Id Token: " + idToken + "\n Access Token: " + accessToken + "\n Refresh Token: " + refreshToken);
                        },
                        error -> Log.e("AfterSignIn", error.toString())
                );
            }
        });

        Button buttonThree = findViewById(R.id.buttonThree);
        buttonThree.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                RestOptions options = RestOptions.builder()
                        .addPath("/AppTestLambda")
                        .addHeader("Host", "<calculated when request is sent>")
                        .addHeader("Authorization", accessToken)
                        .build();

                Amplify.API.post(options,
                        response -> {
                            Log.i("MyAmplifyApi", "POST " + response.getData().asString());
                            Log.i("MyAmplifyApi", "POST code" + response.getCode());
                        },
                        error -> Log.e("MyAmplifyApi", "POST failed", error)
                );
            }
        });
    }


//    private void printTokens(String idToken, String accessToken, String refreshToken) {
//        runOnUiThread(new Runnable() {
//            @Override
//            public void run() {
//                TextView textView = (TextView)findViewById(R.id.tokens);
//
//                textView.setText("Id Token: " + idToken + "\n Access Token: " + accessToken + "\n Refresh Token: " + refreshToken);
//            }
//        });
//    }

    private void printAccessToken(String accessToken) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                TextView textView = (TextView)findViewById(R.id.tokens);

                textView.setText("Access Token: " + accessToken);
            }
        });
    }
    private void login() {
        Amplify.Auth.signInWithWebUI(
                this,
                result -> Log.i("AuthQuickStart", result.toString()),
                error -> Log.e("AuthQuickStart", error.toString())
        );
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);

        if(intent.getData() != null && "myapp".equals(intent.getData().getScheme())) {
            Amplify.Auth.handleWebUISignInResponse(intent);
        }
    }
}