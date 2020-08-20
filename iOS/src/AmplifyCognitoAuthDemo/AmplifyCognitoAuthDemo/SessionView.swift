//
//  SessionView.swift
//  AmplifyCognitoAuthDemo
//
//  Created by Mario Castro Squella on 20-08-20.
//  Copyright © 2020 Technology-Science. All rights reserved.
//

import SwiftUI

struct SessionView: View {
    @EnvironmentObject var auth: AuthService
    
    var body: some View {
        VStack {
            Spacer()
            Text("You are signed in as \(self.auth.getLoggedInUser()?.username ?? "user")")
            Spacer()
            Button("Sign Out") {
                self.auth.signOut()
            }
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(10)
        }
    }
}

struct SessionView_Previews: PreviewProvider {
    static var previews: some View {
        SessionView()
    }
}
