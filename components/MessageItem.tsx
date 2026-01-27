import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { auth } from '@/services/firebase';
import { verticalScale } from '@/utils/styling';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Typo from './Typo';

const MessageItem = ({item, isDirect} : {item:  any, isDirect: boolean}) => {
  const currentUid = auth.currentUser?.uid;
  const isMe = currentUid === item.senderId;

  console.log(item,"-----item")

  return (
    <View 
      style={[
        styles.messageContainer,
        isMe? styles.myMessage : styles.theirMessage
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          isMe? styles.myBubble : styles.theirBubble
        ]}
      > 
        {
          item.text && <Typo size={15}>{item.text}</Typo>
        }
        <Typo
          style={{alignSelf: 'flex-end'}}
          size={11}
          fontWeight={'500'}
          color={colors.neutral600}
        >
          {item.createdAt?.toDate
                ? item.createdAt.toDate().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
        </Typo>
      </View>
    </View>
  )
}

export default MessageItem

const styles = StyleSheet.create({
  attachment: {
    height: verticalScale(180),
    width: verticalScale(180),
    borderRadius: radius._10
  },
  messageBubble: {
    padding: spacingX._10,
    borderRadius: radius._15,
    gap: spacingY._5,
  },
  myBubble: {
    backgroundColor: colors.myBubble,
  },
  theirBubble: {
    backgroundColor: colors.otherBubble,
  },
  messageAvatar: {
    alignSelf: 'flex-end',
  },
  messageContainer: {
    flexDirection: 'row',
    gap: spacingX._7,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
  }


})