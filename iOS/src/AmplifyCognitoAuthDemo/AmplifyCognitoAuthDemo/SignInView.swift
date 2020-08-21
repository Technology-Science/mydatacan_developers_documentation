//
//  SignInView.swift
//  AmplifyCognitoAuthDemo
//
//  Created by Mario Castro Squella on 20-08-20.
//  Copyright © 2020 Technology-Science. All rights reserved.
//

import SwiftUI

struct SignInView: View {
    @EnvironmentObject var auth: AuthService
    
    var body: some View {
        VStack {
            Image("logo")
                .resizable()
                .scaledToFit()
                .padding()
            Button("Sign In") {
                self.auth.webSignIn()
            }
            .padding()
            .background(Color(red: 0.0, green: 0.82, blue: 0.70, opacity: 1.0))
            .foregroundColor(.white)
            .cornerRadius(10)
        }
    }
}

struct SignInView_Previews: PreviewProvider {
    static var previews: some View {
        SignInView()
    }
}
