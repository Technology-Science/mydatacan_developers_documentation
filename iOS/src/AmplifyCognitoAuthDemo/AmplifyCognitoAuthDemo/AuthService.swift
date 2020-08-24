//
//  AuthService.swift
//  AmplifyCognitoAuthDemo
//
//  Created by Mario Castro Squella on 20-08-20.
//  Copyright © 2020 Technology-Science. All rights reserved.
//

import Foundation
import Amplify
import AWSPluginsCore
import JWTDecode

class AuthService: ObservableObject {
    @Published var isSignedIn = false
    @Published var tokens: [String:String]?
    
    func checkSessionStatus() {
        _ = Amplify.Auth.fetchAuthSession{ [weak self] result in
            switch result {
            case .success(let session):
                DispatchQueue.main.async {
                    self?.getTokens(session: session)
                    self?.isSignedIn = session.isSignedIn
                }
                
            case .failure(let error):
                print(error)
            }
        }
    }
    
    private var window: UIWindow {
        guard
            let scene = UIApplication.shared.connectedScenes.first,
            let windowSceneDelegate = scene.delegate as? UIWindowSceneDelegate,
            let window = windowSceneDelegate.window as? UIWindow
            else { return UIWindow() }
        return window
    }
    
    func webSignIn() {
        _ = Amplify.Auth.signInWithWebUI(presentationAnchor: window) { result in
            switch result {
            case .success:
                print("Signed in")
            case .failure(let error):
                print(error)
            }
        }
    }
    
    func observeAuthEvents() {
        _ = Amplify.Hub.listen(to: .auth) { [weak self] result in
            switch result.eventName {
            case HubPayload.EventName.Auth.signedIn:
                DispatchQueue.main.async {
                    self?.isSignedIn = true
                }
            case HubPayload.EventName.Auth.signedOut,
                 HubPayload.EventName.Auth.sessionExpired:
                DispatchQueue.main.async {
                    self?.isSignedIn = false
                }
            default:
                break
            }
        }
    }
    
    func signOut() {
        _ = Amplify.Auth.signOut { result in
            switch result {
            case .success:
                print("Signed out")
            case .failure(let error):
                print(error)
            }
        }
    }
    
    func getLoggedInUser() -> AuthUser? {
        return Amplify.Auth.getCurrentUser()
    }
    
    func getTokens(session: AuthSession) {
        do {
            if let cognitoTokenProvider = session as? AuthCognitoTokensProvider {
                let tokens = try cognitoTokenProvider.getCognitoTokens().get()
                self.tokens = ["idToken": tokens.idToken, "accessToken": tokens.accessToken, "refreshToken": tokens.refreshToken]
            }
        } catch {
            print("Error fetching tokens")
        }
    }
    
    func getClaim(name: String) -> String? {
        do {
            let jwt = try decode(jwt: (self.tokens?["idToken"])!)
            return jwt.claim(name: name).string
        } catch {
            print("Error getting claim")
        }
        return ""
    }
}
