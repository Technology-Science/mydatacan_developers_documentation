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
            Text("Hi!")
                .font(.title)
                .fontWeight(.bold)
                .padding()
            Text("Your username is  \(self.auth.getLoggedInUser()?.username ?? "user")")
                .padding()
                Button("Sign Out") {
                    self.auth.signOut()
                }
                .padding()
                .background(Color(red: 0.0, green: 0.82, blue: 0.70, opacity: 1.0))
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
